"use client"
import { Card, CardContent } from "../ui/card";
import { useNavigate  } from "react-router-dom";

interface ClickableCardProps {
	title: string
	contextText?: string
	icon?: React.ReactNode
	href: string
}

export function ClickableCard({
		title,
		contextText,
		icon,
		href,
	}: ClickableCardProps) {
		const navigate = useNavigate();

		const handleClick = () => {
			navigate(href);
		};

		return (
			<Card
				onClick={handleClick}
				className="cursor-pointer hover:shadow-lg transition-all duration-300"
			>

				<CardContent className="p-6 space-y-2">
					<div className="flex items-center space-x-2 text-gray-400">
						{icon}
						<span className="text-sm">{title}</span>
					</div>
					<div className="flex items-center space-x-2">
						{contextText && (
							<p className="text-xl font-bold sm:block hidden">{contextText}</p>
						)}
					</div>
					
				</CardContent>
			</Card>
		)
}
