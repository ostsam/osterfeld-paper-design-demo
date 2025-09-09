"use client";

import { LayoutValues } from "./FlexPanel";
import { InputField } from "./InputField";
import styles from "./Controls.module.css";
import { ChevronIcon } from "./Icons";

interface LayoutControlsProps {
	theme: 'dark' | 'light';
	values: LayoutValues;
	onChange: (key: keyof LayoutValues, value: number) => void;
	isCollapsed: boolean;
	onToggle: () => void;
}

export function LayoutControls({
	theme,
	values,
	onChange,
	isCollapsed,
	onToggle,
}: LayoutControlsProps) {
	return (
		<div className={`${styles.section} ${styles[theme]}`}>
			<button className={styles.sectionHeader} onClick={onToggle}>
				<span className={styles.sectionTitle}>Layout</span>
				<ChevronIcon
					className={`${styles.chevron} ${isCollapsed ? styles.collapsed : ""}`}
				/>
			</button>

			{!isCollapsed && (
				<div className={styles.controls}>
					<div className={styles.row}>
						<InputField
							theme={theme}
							label="X"
							value={values.x}
							onChange={(value) => onChange("x", value)}
							precision={1}
						/>
						<InputField
							theme={theme}
							label="Y"
							value={values.y}
							onChange={(value) => onChange("y", value)}
							precision={1}
						/>
					</div>

					<div className={styles.row}>
						<InputField
							theme={theme}
							label="W"
							value={values.width}
							onChange={(value) => onChange("width", value)}
							min={1}
							precision={1}
						/>
						<InputField
							theme={theme}
							label="H"
							value={values.height}
							onChange={(value) => onChange("height", value)}
							min={1}
							precision={1}
						/>
					</div>

					<div className={styles.row}>
						<InputField
							theme={theme}
							label="Angle"
							value={values.rotation}
							onChange={(value) => onChange("rotation", value)}
							min={-180}
							max={180}
							precision={1}
							suffix="°"
						/>
						<InputField
							theme={theme}
							label="Radius"
							value={values.radius}
							onChange={(value) => onChange("radius", value)}
							min={0}
							max={100}
							precision={1}
							suffix="px"
						/>
					</div>
				</div>
			)}
		</div>
	);
}
