"use client";

import { useState, useCallback, useEffect } from "react";
import styles from "./FlexPanel.module.css";
import { LayoutControls } from "./LayoutControls";
import { FlexControls } from "./FlexControls";
import { PreviewArea } from "./PreviewArea";

export interface LayoutValues {
	x: number;
	y: number;
	width: number;
	height: number;
	rotation: number;
	radius: number;
}

export interface FlexValues {
	direction: "row" | "column" | "row-reverse" | "column-reverse";
	justifyContent:
		| "start"
		| "center"
		| "end"
		| "space-between"
		| "space-around"
		| "space-evenly";
	alignItems: "start" | "center" | "end" | "stretch" | "baseline";
	gap: number;
	wrap: "nowrap" | "wrap" | "wrap-reverse";
}

export function FlexPanel() {
	const [theme, setTheme] = useState<"dark" | "light">("dark");
	const [layoutValues, setLayoutValues] = useState<LayoutValues>({
		x: 0,
		y: 0,
		width: 320,
		height: 240,
		rotation: 0,
		radius: 0,
	});

	const [flexValues, setFlexValues] = useState<FlexValues>({
		direction: "row",
		justifyContent: "start",
		alignItems: "start",
		gap: 0,
		wrap: "nowrap",
	});

	const [isCollapsed, setIsCollapsed] = useState({
		layout: false,
		flex: false,
	});

	const handleLayoutChange = useCallback(
		(key: keyof LayoutValues, value: number) => {
			setLayoutValues((prev) => ({ ...prev, [key]: value }));
		},
		[]
	);

	const handleFlexChange = useCallback(
		<K extends keyof FlexValues>(key: K, value: FlexValues[K]) => {
			setFlexValues((prev) => ({ ...prev, [key]: value }));
		},
		[]
	);

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.metaKey || e.ctrlKey) {
				switch (e.key) {
					case "d":
						e.preventDefault();
						setFlexValues((prev) => ({
							...prev,
							direction: prev.direction === "row" ? "column" : "row",
						}));
						break;
					case "j":
						e.preventDefault();
						const justifyOptions: FlexValues["justifyContent"][] = [
							"start",
							"center",
							"end",
							"space-between",
							"space-around",
							"space-evenly",
						];
						const currentIndex = justifyOptions.indexOf(
							flexValues.justifyContent
						);
						setFlexValues((prev) => ({
							...prev,
							justifyContent:
								justifyOptions[(currentIndex + 1) % justifyOptions.length],
						}));
						break;
				}
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [flexValues.justifyContent]);

	return (
		<div className={`${styles.container} ${styles[theme]}`}>
			<div className={`${styles.panel} ${styles[theme]}`}>
				<div className={styles.sections}>
					<LayoutControls
						theme={theme}
						values={layoutValues}
						onChange={handleLayoutChange}
						isCollapsed={isCollapsed.layout}
						onToggle={() =>
							setIsCollapsed((prev) => ({ ...prev, layout: !prev.layout }))
						}
					/>

					<FlexControls
						theme={theme}
						values={flexValues}
						onChange={handleFlexChange}
						isCollapsed={isCollapsed.flex}
						onToggle={() =>
							setIsCollapsed((prev) => ({ ...prev, flex: !prev.flex }))
						}
					/>
				</div>

				<div className={styles.footer}>
					<button
						className={styles.themeToggle}
						onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
						title="Toggle theme"
					>
						{theme === "dark" ? (
							<svg
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<circle cx="12" cy="12" r="5" />
								<line x1="12" y1="1" x2="12" y2="3" />
								<line x1="12" y1="21" x2="12" y2="23" />
								<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
								<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
								<line x1="1" y1="12" x2="3" y2="12" />
								<line x1="21" y1="12" x2="23" y2="12" />
								<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
								<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
							</svg>
						) : (
							<svg
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
							</svg>
						)}
					</button>
					<div className={styles.shortcuts}>
						<span className={styles.shortcut}>
							<kbd>⌘D</kbd> Direction
						</span>
						<span className={styles.shortcut}>
							<kbd>Tab</kbd> Next
						</span>
					</div>
				</div>
			</div>

			<PreviewArea
				theme={theme}
				layoutValues={layoutValues}
				flexValues={flexValues}
				onReset={() => {
					setLayoutValues({
						x: 0,
						y: 0,
						width: 320,
						height: 240,
						rotation: 0,
						radius: 0,
					});
					setFlexValues({
						direction: "row",
						justifyContent: "start",
						alignItems: "start",
						gap: 0,
						wrap: "nowrap",
					});
				}}
			/>
		</div>
	);
}
