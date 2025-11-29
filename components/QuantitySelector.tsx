"use client";

import { useState } from "react";
import "./quantity-selector.css";

interface QuantitySelectorProps {
    initialValue?: number;
    min?: number;
    max?: number;
    onChange?: (value: number) => void;
}

export default function QuantitySelector({
    initialValue = 1,
    min = 1,
    max = 999,
    onChange,
}: QuantitySelectorProps) {
    const [quantity, setQuantity] = useState(initialValue);
    const [inputValue, setInputValue] = useState(String(initialValue));

    const handleIncrement = () => {
        if (quantity < max) {
            const newValue = quantity + 1;
            setQuantity(newValue);
            setInputValue(String(newValue));
            onChange?.(newValue);
        }
    };

    const handleDecrement = () => {
        if (quantity > min) {
            const newValue = quantity - 1;
            setQuantity(newValue);
            setInputValue(String(newValue));
            onChange?.(newValue);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        setInputValue(rawValue);

        const value = Number.parseInt(rawValue, 10);
        if (!Number.isNaN(value) && value >= min && value <= max) {
            setQuantity(value);
            onChange?.(value);
        }
    };

    const handleBlur = () => {
        // On blur, reset to valid quantity if input is invalid
        if (inputValue === "" || Number.isNaN(Number.parseInt(inputValue, 10))) {
            setInputValue(String(quantity));
        } else {
            const value = Number.parseInt(inputValue, 10);
            if (value < min) {
                setQuantity(min);
                setInputValue(String(min));
                onChange?.(min);
            } else if (value > max) {
                setQuantity(max);
                setInputValue(String(max));
                onChange?.(max);
            }
        }
    };

    return (
        <div className="quantity-selector">
            <button
                type="button"
                className="quantity-btn"
                onClick={handleDecrement}
                disabled={quantity <= min}
                aria-label="Diminuir quantidade"
            >
                −
            </button>
            <input
                type="number"
                className="quantity-input"
                value={inputValue}
                onChange={handleChange}
                onBlur={handleBlur}
                min={min}
                max={max}
                aria-label="Quantidade"
            />
            <button
                type="button"
                className="quantity-btn"
                onClick={handleIncrement}
                disabled={quantity >= max}
                aria-label="Aumentar quantidade"
            >
                +
            </button>
        </div>
    );
}
