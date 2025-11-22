import { useEffect, useState } from "react";

export default function FadeIn({messages = [], delay = 1000, fade = 1000}) {
	const [index, setIndex] = useState(0);

	useEffect(() => {
		if (index < messages.length) {
			const timer = setTimeout(() => {
				setIndex(prev => prev + 1);
			}, delay);

			return () => clearTimeout(timer);
		}
	}, [index, messages.length, delay]);

	return (
		<div className="endMessage">
			{messages.map((msg, idx) => (
				<p
					key={idx}
					style={{
						opacity: idx < index ? 1 : 0,
						transform: `translateY(${idx < index ? 0 : 20}px)`,
						transition: `${fade}ms`
					}}
				>
					{msg}
				</p>
			))}
		</div>
	);
}