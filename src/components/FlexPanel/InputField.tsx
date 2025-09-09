"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import styles from "./InputField.module.css";

interface InputFieldProps {
	theme: 'dark' | 'light';
	label: string;
	value: number;
	onChange: (value: number) => void;
	min?: number;
	max?: number;
	precision?: number;
	suffix?: string;
	fullWidth?: boolean;
}

export function InputField({
	theme,
	label,
	value,
	onChange,
	min = -Infinity,
	max = Infinity,
	precision = 0,
	suffix = "",
	fullWidth = false,
}: InputFieldProps) {
	const [displayValue, setDisplayValue] = useState(value.toFixed(precision));
	const [isFocused, setIsFocused] = useState(false);
	const [isHovering, setIsHovering] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	// Smart rounding based on input patterns
	const smartRound = useCallback(
		(val: number): number => {
			if (Math.abs(val) < 0.01) return 0;

			// Snap to common values
			const snapPoints = [0, 45, 90, 135, 180, -45, -90, -135, -180];
			for (const point of snapPoints) {
				if (Math.abs(val - point) < 3) return point;
			}

			// Round to steps of 5 when near them
			const roundedToFive = Math.round(val / 5) * 5;
			if (Math.abs(val - roundedToFive) < 2) return roundedToFive;

			return Number(val.toFixed(precision));
		},
		[precision]
	);

	useEffect(() => {
		if (!isFocused) {
			setDisplayValue(value.toFixed(precision));
		}
	}, [value, precision, isFocused]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const raw = e.target.value;
		setDisplayValue(raw);

		// Allow intermediate states
		if (raw === "" || raw === "-" || raw === ".") return;

		const parsed = parseFloat(raw);
		if (!isNaN(parsed)) {
			const clamped = Math.max(min, Math.min(max, parsed));
			onChange(clamped);
		}
	};

	const handleBlur = () => {
		setIsFocused(false);
		const parsed = parseFloat(displayValue);
		if (!isNaN(parsed)) {
			const final = smartRound(Math.max(min, Math.min(max, parsed)));
			onChange(final);
			setDisplayValue(final.toFixed(precision));
		} else {
			setDisplayValue(value.toFixed(precision));
		}
	};

	const handleWheel = (e: React.WheelEvent) => {
		if (!isHovering) return;
		e.preventDefault();

		const delta = e.deltaY > 0 ? -1 : 1;
		const step = e.shiftKey ? 10 : e.altKey ? 0.1 : 1;
		const newValue = Math.max(min, Math.min(max, value + delta * step));

		onChange(smartRound(newValue));
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "ArrowUp" || e.key === "ArrowDown") {
			e.preventDefault();
			const delta = e.key === "ArrowUp" ? 1 : -1;
			const step = e.shiftKey ? 10 : e.altKey ? 0.1 : 1;
			const newValue = Math.max(min, Math.min(max, value + delta * step));
			onChange(smartRound(newValue));
		}
	};

	// Show contextual hints
	const getHint = () => {
		if (label === "Angle" && value !== 0) {
			if (value % 45 === 0) return "aligned";
			if (Math.abs(value % 45) < 5) return "near snap";
		}
		return null;
	};

	const hint = getHint();

	return (
		<div
			className={`${styles.field} ${styles[theme]} ${fullWidth ? styles.fullWidth : ""} ${
				isFocused ? styles.focused : ""
			}`}
			ref={containerRef}
			onMouseEnter={() => setIsHovering(true)}
			onMouseLeave={() => setIsHovering(false)}
			onWheel={handleWheel}
		>
			<div className={styles.labelRow}>
				<label className={styles.label}>{label}</label>
				{hint && <span className={styles.hint}>{hint}</span>}
			</div>
			<div className={styles.inputWrapper}>
				<input
					ref={inputRef}
					type="text"
					value={displayValue}
					onChange={handleChange}
					onFocus={() => setIsFocused(true)}
					onBlur={handleBlur}
					onKeyDown={handleKeyDown}
					className={styles.input}
					spellCheck={false}
					autoComplete="off"
				/>
				{suffix && <span className={styles.suffix}>{suffix}</span>}
			</div>
		</div>
	);
}
