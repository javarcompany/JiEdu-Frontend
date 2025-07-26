import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";

type ProgressBarProps = {
    paymentProgress: number; // value from 0 to 100
};

export default function PaymentProgressBar({ paymentProgress }: ProgressBarProps) {
    const [displayValue, setDisplayValue] = useState(0);
    const controls = useAnimation();

    const getColor = (value: number) => {
        if (value <= 30) return "#dc2626"; // red
        if (value <= 50) return "#eab308"; // yellow
        if (value <= 80) return "#2563eb"; // blue
        return "#16a34a"; // green
    };

    const getStatus = (value: number) => {
        if (value <= 30) return "Very Low Payment";
        if (value <= 50) return "Partially Paid";
        if (value <= 100) return "Almost Cleared";
        if (value == 100) return "Cleared";
        return "Overpaid";
    };

    useEffect(() => {
        setDisplayValue(0);
        let start = displayValue;
        const end = paymentProgress;
        const duration = 1000; // ms
        const stepTime = 10;
        const steps = duration / stepTime;
        const increment = (end - start) / steps;

        const interval = setInterval(() => {
            start += increment;
            if ((increment > 0 && start >= end) || (increment < 0 && start <= end)) {
                start = end;
                clearInterval(interval);
            }
            setDisplayValue(Math.round(start));
        }, stepTime);

        controls.start({
            width: `${paymentProgress}%`,
            backgroundColor: getColor(paymentProgress),
        });

        return () => clearInterval(interval);
    }, [paymentProgress]);

    return (
        <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                Payment Progress
            </h2>
            <div
                className="h-6 bg-gray-200 rounded-full overflow-hidden relative"
                data-tooltip-id="progress-tooltip"
                data-tooltip-content={`${getStatus(paymentProgress)}: ${displayValue}%`}
            >
                <motion.div
                    initial={{ width: 0, backgroundColor: "#dc2626" }}
                    animate={controls}
                    transition={{ duration: 1.2 }}
                    className="h-full text-white text-sm font-medium flex items-center justify-center"
                >
                    {displayValue}%
                </motion.div>
            </div>
            <Tooltip id="progress-tooltip" />
        </div>
    );
}
