"use client";

import { LayoutValues, FlexValues } from "./FlexPanel";
import styles from "./PreviewArea.module.css";
import { useState, useRef, useEffect, useLayoutEffect } from "react";

interface PreviewAreaProps {
	theme: "dark" | "light";
	layoutValues: LayoutValues;
	flexValues: FlexValues;
	onReset: () => void;
}

export function PreviewArea({
	theme,
	layoutValues,
	flexValues,
	onReset,
}: PreviewAreaProps) {
	const [itemCount, setItemCount] = useState(3);
	const [zoom, setZoom] = useState(100);
	const containerRef = useRef<HTMLDivElement>(null);
	const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
	const previousFlexValues = useRef<FlexValues>(flexValues);

	const items = Array.from({ length: itemCount }, (_, i) => i + 1);

	// FLIP animation for flex changes
	useLayoutEffect(() => {
		if (!containerRef.current) return;

		const itemElements = itemRefs.current.filter(Boolean) as HTMLDivElement[];
		
		// Check if layout-affecting flex values changed
		const layoutChanged = 
			previousFlexValues.current.direction !== flexValues.direction ||
			previousFlexValues.current.justifyContent !== flexValues.justifyContent ||
			previousFlexValues.current.alignItems !== flexValues.alignItems ||
			previousFlexValues.current.wrap !== flexValues.wrap;

		if (layoutChanged && itemElements.length > 0) {
			// Get the pre-captured positions from before the state change
			const capturedPositions = (window as typeof window & { __flipPositions?: { id: string; x: number; y: number }[] }).__flipPositions || [];			
			requestAnimationFrame(() => {
				// Get current positions (after layout change)
				const currentPositions = itemElements.map((el) => {
					const rect = el.getBoundingClientRect();
					return { x: rect.left, y: rect.top };
				});

				// Apply FLIP animation
				itemElements.forEach((el, index) => {
					const flipId = `item-${index}`;
					const capturedPos = capturedPositions.find(p => p.id === flipId);
					const currentPos = currentPositions[index];

					if (!capturedPos) {
						return;
					}

					const deltaX = capturedPos.x - currentPos.x;
					const deltaY = capturedPos.y - currentPos.y;

					// Disable transitions and apply inverse transform
					el.style.transition = 'none';
					el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

					// Force reflow
					void el.offsetHeight;

					// Enable transitions and animate to final position
					el.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
					el.style.transform = 'translate(0, 0)';

					// Clear transform after animation
					setTimeout(() => {
						el.style.transition = '';
						el.style.transform = '';
					}, 400);
				});

				// Clear the captured positions
				delete (window as typeof window & { __flipPositions?: { id: string; x: number; y: number }[] }).__flipPositions;
			});
		}

		previousFlexValues.current = { ...flexValues };
	}, [flexValues]);

	// Clean up transforms when item count changes
	useEffect(() => {
		itemRefs.current = itemRefs.current.slice(0, itemCount);
		// Add new refs if needed
		while (itemRefs.current.length < itemCount) {
			itemRefs.current.push(null);
		}
	}, [itemCount]);

	const containerStyle: React.CSSProperties = {
		transform: `
      translate(${layoutValues.x}px, ${layoutValues.y}px) 
      rotate(${layoutValues.rotation}deg)
      scale(${zoom / 100})
    `,
		width: `${layoutValues.width}px`,
		height: `${layoutValues.height}px`,
		borderRadius: `${layoutValues.radius}px`,
		display: "flex",
		flexDirection: flexValues.direction,
		justifyContent:
			flexValues.justifyContent === "start"
				? "flex-start"
				: flexValues.justifyContent === "end"
				? "flex-end"
				: flexValues.justifyContent,
		alignItems:
			flexValues.alignItems === "start"
				? "flex-start"
				: flexValues.alignItems === "end"
				? "flex-end"
				: flexValues.alignItems,
		gap: `${flexValues.gap}px`,
		flexWrap: flexValues.wrap,
	};

	return (
		<div className={`${styles.previewArea} ${styles[theme]}`}>
			<div className={styles.viewport}>
				<div className={styles.canvas}>
					{/* Grid dots */}
					<div className={styles.gridPattern} />

					{/* Origin marker */}
					<div className={styles.origin}>
						<div className={styles.originX} />
						<div className={styles.originY} />
					</div>

					{/* Container with items */}
					<div ref={containerRef} className={styles.container} style={containerStyle}>
						{items.map((item, index) => (
							<div 
								key={item} 
								ref={el => { itemRefs.current[index] = el; }}
								data-flip-id={`item-${index}`}
								className={styles.item}
							>
								{item}
							</div>
						))}
					</div>
				</div>
			</div>

			<div className={styles.toolbar}>
				<div className={styles.itemControls}>
					<button
						className={styles.toolButton}
						onClick={() => setItemCount(Math.max(1, itemCount - 1))}
						disabled={itemCount <= 1}
					>
						−
					</button>
					<span className={styles.itemCount}>{itemCount} items</span>
					<button
						className={styles.toolButton}
						onClick={() => setItemCount(Math.min(10, itemCount + 1))}
						disabled={itemCount >= 10}
					>
						+
					</button>
				</div>

				<div className={styles.zoomControls}>
					<button
						className={styles.toolButton}
						onClick={() => setZoom(Math.max(50, zoom - 25))}
						disabled={zoom <= 50}
					>
						−
					</button>
					<span className={styles.zoomLevel}>{zoom}%</span>
					<button
						className={styles.toolButton}
						onClick={() => setZoom(Math.min(200, zoom + 25))}
						disabled={zoom >= 200}
					>
						+
					</button>
				</div>

				<button
					className={styles.resetButton}
					onClick={() => {
						setZoom(100);
						setItemCount(3);
						onReset();
					}}
				>
					<span>Reset</span>
				</button>
			</div>
		</div>
	);
}
