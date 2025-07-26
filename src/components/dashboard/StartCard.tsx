"use client"
import { Card, CardContent } from "../ui/card";
import { useNavigate  } from "react-router-dom";

interface ClickableStatCardProps {
	title: string
	value: string | number
	percentageChange?: string
	contextText?: string
	icon?: React.ReactNode
	href: string
	classvalue?: string
	onClick?: () => void
	
}

export function ClickableStatCard({
		title,
		value,
		percentageChange,
		contextText,
		icon,
		classvalue,
		href,
		onClick,
	}: ClickableStatCardProps) {
		const navigate = useNavigate();

		const handleClick = () => {
			if (onClick) {
				onClick(); // use custom click handler
			} else if (href) {
				navigate(href); // default navigation
			}
		};

		return (
			<Card
				onClick={handleClick}
				className="cursor-pointer hover:shadow-lg transition-all duration-300"
			>
				<CardContent className="p-6 space-y-2">
					<div className="flex items-center space-x-2 text-gray-400">
						{icon} <span className="text-sm">{title}</span>
					</div>
					<div className="flex items-center space-x-2">
						<h2 className="text-xl font-bold dark:text-white text-gray-800 sm:text-xl">{value}</h2>
						{percentageChange && (
							<span className={`sm:block text-xs font-medium px-2 py-1 rounded-full ${classvalue}`}>
							{percentageChange}
							</span>
						)}
						{contextText && (
							<p className="text-xs text-gray-500 sm:block">{contextText}</p>
						)}
					</div>
					
				</CardContent>
			</Card>
		)
}
