// utils/apiFetch.ts
import api from "../lib/axois";

export const fetchDropdownData = async (url: string, labelKey = "name", valueKey = "id") => {
	const token = localStorage.getItem("access");
	try {
		const response = await api.get(url,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		const data = response.data.results || response.data; // supports paginated & non-paginated
		return data.map((item: any) => ({
			value: item[valueKey].toString(),
			label: item[labelKey],
		}));
	} catch (error) {
		console.error(`Failed to fetch from ${url}`, error);
		return [];
	}
};
   