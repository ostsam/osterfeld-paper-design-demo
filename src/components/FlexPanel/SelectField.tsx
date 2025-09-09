"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./SelectField.module.css";
import { DropdownPortal } from "./DropdownPortal";

interface Option {
	value: string;
	label: string;
}

interface SelectFieldProps {
	theme: "dark" | "light";
	label: string;
	value: string;
	onChange: (value: string) => void;
	options: Option[];
}

export function SelectField({
	theme,
	label,
	value,
	onChange,
	options,
}: SelectFieldProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [dropdownPosition, setDropdownPosition] = useState({
		top: 0,
		left: 0,
		width: 0,
	});
	const selectRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const currentOption = options.find((opt) => opt.value === value);

	useEffect(() => {
		if (isOpen && buttonRef.current) {
			const rect = buttonRef.current.getBoundingClientRect();
			setDropdownPosition({
				top: rect.bottom + 4,
				left: rect.left,
				width: rect.width,
			});
		}
	}, [isOpen]);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			const target = e.target as Node;
			const clickedInSelect =
				selectRef.current && selectRef.current.contains(target);
			const clickedInDropdown =
				dropdownRef.current && dropdownRef.current.contains(target);

			if (!clickedInSelect && !clickedInDropdown) {
				setIsOpen(false);
			}
		};

		const handleScroll = () => {
			if (isOpen && buttonRef.current) {
				const rect = buttonRef.current.getBoundingClientRect();
				setDropdownPosition({
					top: rect.bottom + 4,
					left: rect.left,
					width: rect.width,
				});
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
			document.addEventListener("scroll", handleScroll, true);
			window.addEventListener("resize", handleScroll);
			return () => {
				document.removeEventListener("mousedown", handleClickOutside);
				document.removeEventListener("scroll", handleScroll, true);
				window.removeEventListener("resize", handleScroll);
			};
		}
	}, [isOpen]);

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			setIsOpen(!isOpen);
		} else if (e.key === "Escape") {
			setIsOpen(false);
		} else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
			e.preventDefault();
			const currentIndex = options.findIndex((opt) => opt.value === value);
			const direction = e.key === "ArrowDown" ? 1 : -1;
			const newIndex =
				(currentIndex + direction + options.length) % options.length;
			onChange(options[newIndex].value);
		}
	};

	return (
		<div className={`${styles.field} ${styles[theme]}`} ref={selectRef}>
			<label className={styles.label}>{label}</label>
			<button
				ref={buttonRef}
				className={`${styles.select} ${isOpen ? styles.open : ""}`}
				onClick={() => setIsOpen(!isOpen)}
				onKeyDown={handleKeyDown}
				type="button"
			>
				<span className={styles.value}>{currentOption?.label}</span>
				<svg className={styles.arrow} width="8" height="8" viewBox="0 0 8 8">
					<path
						d="M1 3L4 6L7 3"
						stroke="currentColor"
						fill="none"
						strokeWidth="1.5"
						strokeLinecap="round"
					/>
				</svg>
			</button>

			{isOpen && (
				<DropdownPortal>
					<div
						ref={dropdownRef}
						className={`${styles.dropdown} ${styles[theme]}`}
						style={{
							top: `${dropdownPosition.top}px`,
							left: `${dropdownPosition.left}px`,
							width: `${dropdownPosition.width}px`,
						}}
					>
						{options.map((option) => (
							<button
								key={option.value}
								className={`${styles.option} ${
									option.value === value ? styles.selected : ""
								}`}
								onClick={() => {
									onChange(option.value);
									setIsOpen(false);
								}}
								type="button"
							>
								{option.label}
							</button>
						))}
					</div>
				</DropdownPortal>
			)}
		</div>
	);
}
