"use client";

import { FlexValues } from "./FlexPanel";
import { SelectField } from "./SelectField";
import { InputField } from "./InputField";
import styles from "./Controls.module.css";
import { ChevronIcon } from "./Icons";

interface FlexControlsProps {
	theme: 'dark' | 'light';
	values: FlexValues;
	onChange: <K extends keyof FlexValues>(key: K, value: FlexValues[K]) => void;
	isCollapsed: boolean;
	onToggle: () => void;
}

const directionOptions = [
	{ value: "row", label: "Row" },
	{ value: "column", label: "Column" },
	{ value: "row-reverse", label: "Row Reverse" },
	{ value: "column-reverse", label: "Column Reverse" },
];

const justifyOptions = [
	{ value: "start", label: "Start" },
	{ value: "center", label: "Center" },
	{ value: "end", label: "End" },
	{ value: "space-between", label: "Between" },
	{ value: "space-around", label: "Around" },
	{ value: "space-evenly", label: "Evenly" },
];

const alignOptions = [
	{ value: "start", label: "Start" },
	{ value: "center", label: "Center" },
	{ value: "end", label: "End" },
	{ value: "stretch", label: "Stretch" },
	{ value: "baseline", label: "Baseline" },
];

const wrapOptions = [
	{ value: "nowrap", label: "No Wrap" },
	{ value: "wrap", label: "Wrap" },
	{ value: "wrap-reverse", label: "Reverse" },
];

export function FlexControls({
	theme,
	values,
	onChange,
	isCollapsed,
	onToggle,
}: FlexControlsProps) {
	return (
		<div className={`${styles.section} ${styles[theme]}`}>
			<button className={styles.sectionHeader} onClick={onToggle}>
				<span className={styles.sectionTitle}>Flex</span>
				<ChevronIcon
					className={`${styles.chevron} ${isCollapsed ? styles.collapsed : ""}`}
				/>
			</button>

			{!isCollapsed && (
				<div className={styles.controls}>
					<SelectField
						theme={theme}
						label="Direction"
						value={values.direction}
						onChange={(value) =>
							onChange("direction", value as FlexValues["direction"])
						}
						options={directionOptions}
					/>

					<SelectField
						theme={theme}
						label="Justify"
						value={values.justifyContent}
						onChange={(value) =>
							onChange("justifyContent", value as FlexValues["justifyContent"])
						}
						options={justifyOptions}
					/>

					<SelectField
						theme={theme}
						label="Align"
						value={values.alignItems}
						onChange={(value) =>
							onChange("alignItems", value as FlexValues["alignItems"])
						}
						options={alignOptions}
					/>

					<div className={styles.row}>
						<InputField
							theme={theme}
							label="Gap"
							value={values.gap}
							onChange={(value) => onChange("gap", value)}
							min={0}
							max={100}
							precision={0}
							fullWidth
						/>
					</div>

					<SelectField
						theme={theme}
						label="Wrap"
						value={values.wrap}
						onChange={(value) => onChange("wrap", value as FlexValues["wrap"])}
						options={wrapOptions}
					/>
				</div>
			)}
		</div>
	);
}
