import React, { useState, useEffect } from "react";
import "./filters.css";

import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";

import FilterSection from "../filterSelection/FilterSelection.js";

function Filters({ onChange, onClose }) {
    const [local, setLocal] = useState({
        price: [],
        bhk: [],
        carpet: [],
        type: [],
    });

    // ✅ Notify parent AFTER render
    useEffect(() => {
        if (onChange) {
            onChange(local);
        }
    }, [local, onChange]);

    const toggleValue = (key, value) => {
        setLocal((prev) => {
            const exists = prev[key].includes(value);

            return {
                ...prev,
                [key]: exists
                    ? prev[key].filter((v) => v !== value)
                    : [...prev[key], value],
            };
        });
    };

    return (
        <div className="f-s-c-container">
            {/* PRICE */}
            <div className="filter-header">
                <IconButton size="small" >
                    <CloseIcon onClick={onClose}/>
                </IconButton>
            </div>
            <FilterSection title="Price Range">
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Checkbox
                                size="small"
                                checked={local.price.includes("0-1")}
                                onChange={() => toggleValue("price", "0-1")}
                            />
                        }
                        label="0 – 1 Cr"
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                size="small"
                                checked={local.price.includes("1-5")}
                                onChange={() => toggleValue("price", "1-5")}
                            />
                        }
                        label="1 – 5 Cr"
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                size="small"
                                checked={local.price.includes("5+")}
                                onChange={() => toggleValue("price", "5+")}
                            />
                        }
                        label="More than 5 Cr"
                    />
                </FormGroup>
            </FilterSection>

            {/* BHK */}
            <FilterSection title="BHK Configuration">
                <FormGroup row>
                    {[1, 2, 3, 4, 5].map((b) => (
                        <FormControlLabel
                            key={b}
                            control={
                                <Checkbox
                                    size="small"
                                    checked={local.bhk.includes(b)}
                                    onChange={() => toggleValue("bhk", b)}
                                />
                            }
                            label={`${b}${b === 5 ? "+" : ""} BHK`}
                        />
                    ))}
                </FormGroup>
            </FilterSection>

            {/* CARPET */}
            <FilterSection title="Carpet Area">
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Checkbox
                                size="small"
                                checked={local.carpet.includes("0-1000")}
                                onChange={() => toggleValue("carpet", "0-1000")}
                            />
                        }
                        label="0 – 1000 sq.ft"
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                size="small"
                                checked={local.carpet.includes("1000-2500")}
                                onChange={() => toggleValue("carpet", "1000-2500")}
                            />
                        }
                        label="1000 – 2500 sq.ft"
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                size="small"
                                checked={local.carpet.includes("2500-5000")}
                                onChange={() => toggleValue("carpet", "2500-5000")}
                            />
                        }
                        label="2500 – 5000 sq.ft"
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                size="small"
                                checked={local.carpet.includes("5000+")}
                                onChange={() => toggleValue("carpet", "5000+")}
                            />
                        }
                        label="More than 5000 sq.ft"
                    />
                </FormGroup>
            </FilterSection>

            {/* TYPE */}
            <FilterSection title="Property Type" showDivider={false}>
                <FormGroup>
                    {["residential", "commercial", "plot"].map((t) => (
                        <FormControlLabel
                            key={t}
                            control={
                                <Checkbox
                                    size="small"
                                    checked={local.type.includes(t)}
                                    onChange={() => toggleValue("type", t)}
                                />
                            }
                            label={t.charAt(0).toUpperCase() + t.slice(1)}
                        />
                    ))}
                </FormGroup>
            </FilterSection>
        </div>
    );
}

export default Filters;
