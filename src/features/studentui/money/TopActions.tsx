import FeeCard from "./FeeCard";

export default function TopComponents({ payment }: { payment: boolean }) {

    return (
        <>
            <div className="gap-4 md:col-span-12">
                <FeeCard updated={payment} />
            </div>
        </>
    );
}