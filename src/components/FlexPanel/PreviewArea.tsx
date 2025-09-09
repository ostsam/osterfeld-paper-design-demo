"use client";

import { LayoutValues, FlexValues } from "./FlexPanel";
import styles from "./PreviewArea.module.css";
import { useState } from "react";

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

	const items = Array.from({ length: itemCount }, (_, i) => i + 1);

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
					<div className={styles.container} style={containerStyle}>
						{items.map((item) => (
							<div key={item} className={styles.item}>
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
