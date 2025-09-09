export function ChevronIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			width="10"
			height="10"
			viewBox="0 0 10 10"
			fill="none"
		>
			<path
				d="M3 4L5 6L7 4"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
