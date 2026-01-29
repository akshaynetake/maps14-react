import "./map.css";
import {
    GoogleMap,
    Marker,
    OverlayView,
    Autocomplete,
} from "@react-google-maps/api";
import React, { useState, useRef, useMemo } from "react";

import SearchIcon from "@material-ui/icons/Search";
import Box from "@material-ui/core/Box";

import MapCard from "../mapCard/MapCard.js";
import Filters from "../filter/Filter.js";

const containerStyle = {
    width: "100%",
    height: "100%",
};

const mapOptions = {
    disableDefaultUI: true,
    clickableIcons: false,
    styles: [
        { featureType: "poi", stylers: [{ visibility: "off" }] },
        { featureType: "transit", stylers: [{ visibility: "off" }] },
        {
            featureType: "road",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
        },
    ],
};

function Map({ center, locations, setOpenFilters }) {
    const [hovered, setHovered] = useState(null);
    const [mapBounds, setMapBounds] = useState(null);
    const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState({
        price: [],
        bhk: [],
        carpet: [],
        type: [],
    });

    const mapRef = useRef(null);
    const autocompleteRef = useRef(null);
    const closeTimer = useRef(null);
    const debounceRef = useRef(null);

    /* -------------------- VIEWPORT UTILS -------------------- */
    const extractBounds = (bounds) => {
        if (!bounds) return null;

        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();

        return {
            north: ne.lat(),
            east: ne.lng(),
            south: sw.lat(),
            west: sw.lng(),
        };
    };

    const sendViewportToApi = async (bounds) => {
        const viewport = extractBounds(bounds);
        if (!viewport) return;

        console.log("📍 Viewport payload:", viewport);

        // 🔥 simulate API delay
        await new Promise((res) => setTimeout(res, 1000));
    };

    /* -------------------- MAP EVENTS -------------------- */
    const handleMapMoveStart = () => {
        setLoading(true);
    };

    const handleMapIdle = () => {
        if (!mapRef.current) return;

        const bounds = mapRef.current.getBounds();
        setMapBounds(bounds);

        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            await sendViewportToApi(bounds);
            setLoading(false);
        }, 400);
    };

    /* -------------------- SEARCH -------------------- */
    const handlePlaceChanged = () => {
        if (!autocompleteRef.current || !mapRef.current) return;

        const place = autocompleteRef.current.getPlace();
        if (!place?.geometry) return;

        const loc = place.geometry.location;
        mapRef.current.panTo({ lat: loc.lat(), lng: loc.lng() });
        mapRef.current.setZoom(14);
        setLoading(true);
    };

    /* -------------------- CARD HOVER -------------------- */
    const openCard = (loc) => {
        clearTimeout(closeTimer.current);
        setHovered(loc);
    };

    const closeCard = () => {
        closeTimer.current = setTimeout(() => {
            setHovered(null);
        }, 120);
    };

    /* -------------------- AUTOCOMPLETE FIX -------------------- */
    const syncPacWidth = () => {
        const input = document.getElementById("map-search-input");
        const pac = document.querySelector(".pac-container");

        if (input && pac) {
            const rect = input.getBoundingClientRect();
            pac.style.width = rect.width + "px";
            pac.style.left = rect.left + "px";
            pac.style.top = rect.bottom + 6 + "px";
        }
    };

    /* -------------------- FILTERED LOCATIONS -------------------- */
    const filteredLocations = useMemo(() => {
        return locations.filter((item) => {
            if (filters.price.length) {
                const ok = filters.price.some((r) => {
                    if (r === "0-1") return item.priceCr <= 1;
                    if (r === "1-5") return item.priceCr > 1 && item.priceCr <= 5;
                    if (r === "5+") return item.priceCr > 5;
                    return false;
                });
                if (!ok) return false;
            }

            if (filters.bhk.length && !filters.bhk.includes(item.bhk)) {
                return false;
            }

            if (filters.carpet.length) {
                const ok = filters.carpet.some((r) => {
                    if (r === "0-1000") return item.carpet <= 1000;
                    if (r === "1000-2500")
                        return item.carpet > 1000 && item.carpet <= 2500;
                    if (r === "2500-5000")
                        return item.carpet > 2500 && item.carpet <= 5000;
                    if (r === "5000+") return item.carpet > 5000;
                    return false;
                });
                if (!ok) return false;
            }

            if (filters.type.length && !filters.type.includes(item.type)) {
                return false;
            }

            if (mapBounds) {
                const pos = new window.google.maps.LatLng(item.lat, item.lng);
                if (!mapBounds.contains(pos)) return false;
            }

            return true;
        });
    }, [filters, mapBounds, locations]);

    /* -------------------- RENDER -------------------- */
    return (
        <div className="m-f-container">
            <div className="m-container">
                <Box className="map-search">
                    <SearchIcon style={{ color: "#1a73e8", marginRight: 8 }} />

                    <Autocomplete
                        onLoad={(auto) => (autocompleteRef.current = auto)}
                        onPlaceChanged={handlePlaceChanged}
                    >
                        <input
                            id="map-search-input"
                            type="text"
                            placeholder="Search in Area, Property or Location"
                            className="map-search-input"
                            onKeyUp={syncPacWidth}
                            onFocus={syncPacWidth}
                        />
                    </Autocomplete>
                </Box>

                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={12}
                    options={mapOptions}
                    onLoad={(map) => {
                        mapRef.current = map;
                        setMapBounds(map.getBounds());
                    }}
                    onDragStart={handleMapMoveStart}
                    onZoomChanged={handleMapMoveStart}
                    onIdle={handleMapIdle}
                >
                    {filteredLocations.map((loc) => (
                        <Marker
                            key={loc.id}
                            position={{ lat: loc.lat, lng: loc.lng }}
                            onMouseOver={() => openCard(loc)}
                            onMouseOut={closeCard}
                        />
                    ))}

                    {hovered && (
                        <OverlayView
                            position={{ lat: hovered.lat, lng: hovered.lng }}
                            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                        >
                            <MapCard
                                data={hovered}
                                onEnter={() => openCard(hovered)}
                                onLeave={closeCard}
                            />
                        </OverlayView>
                    )}

                    {/* 🔥 LOADING OVERLAY */}
                    {loading && (
                        <div className="map-loading-fixed">
                            <div className="spinner" />
                            <span className="loading-text">Loading properties</span>
                        </div>
                    )}
                </GoogleMap>
            </div>

            <div className="f-container">
                <Filters onClose={() => setOpenFilters(false)} onChange={setFilters} />
            </div>
        </div>
    );
}

export default Map;
