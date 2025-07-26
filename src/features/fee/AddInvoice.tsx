import { useState, useEffect } from "react";
import Modal from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import SearchableSelect from "../../components/form/DictSelect";
import Button from "../../components/ui/button/Button";
import Swal from "sweetalert2";
import axios from "axios";

export default function InvoiceModal({ isOpen, onClose, onSuccess }) {
    const token = localStorage.getItem("access");

    const [formData, setFormData] = useState({
        mode: "course", // or "student"
        course: "",
        student: "",
        term: "",
        voteheads: [],
    });

    const [courses, setCourses] = useState([]);
    const [terms, setTerms] = useState([]);
    const [students, setStudents] = useState([]);
    const [voteheadOptions, setVoteheadOptions] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const [c, t, v] = await Promise.all([
                axios.get("/api/courses/", config),
                axios.get("/api/terms/", config),
                axios.get("/api/voteheads/", config),
            ]);
            setCourses(c.data);
            setTerms(t.data);
            setVoteheadOptions(v.data);
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (formData.course && formData.mode === "student") {
            axios.get(`/api/students/?course=${formData.course}`, config).then(res => setStudents(res.data));
        }
    }, [formData.course, formData.mode]);

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const handleVoteheadChange = (index, field, value) => {
        const updated = [...formData.voteheads];
        updated[index][field] = value;
        setFormData(prev => ({ ...prev, voteheads: updated }));
    };

    const addVotehead = () => {
        setFormData(prev => ({
            ...prev, voteheads: [...prev.voteheads, { votehead: "", amount: 0 }],
        }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await axios.post("/api/invoices/", formData, config);
            Swal.fire("Success", "Invoice created successfully", "success");
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to create invoice", "error");
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl">
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Create Invoice</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <div>
                            <Label>Mode</Label>
                            <select
                                className="form-select"
                                value={formData.mode}
                                onChange={e => setFormData(prev => ({ ...prev, mode: e.target.value }))}
                            >
                                <option value="course">Whole Course</option>
                                <option value="student">Specific Student</option>
                            </select>
                        </div>

                        <div>
                            <Label>Course</Label>
                            <SearchableSelect
                                items={courses.map(c => ({ label: c.name, value: c.id }))}
                                onSelect={val => setFormData(prev => ({ ...prev, course: val }))}
                            />
                        </div>

                        {formData.mode === "student" && (
                            <div className="lg:col-span-2">
                                <Label>Student</Label>
                                <SearchableSelect
                                    items={students.map(s => ({ label: s.full_name, value: s.id }))}
                                    onSelect={val => setFormData(prev => ({ ...prev, student: val }))}
                                />
                            </div>
                        )}

                        <div className="lg:col-span-2">
                            <Label>Term</Label>
                            <SearchableSelect
                                items={terms.map(t => ({ label: t.termyear, value: t.id }))}
                                onSelect={val => setFormData(prev => ({ ...prev, term: val }))}
                            />
                        </div>

                        <div className="lg:col-span-2">
                            <Label>Voteheads</Label>
                            {formData.voteheads.map((vh, index) => (
                                <div key={index} className="flex gap-4 mb-2">
                                    <select
                                        className="form-select w-1/2"
                                        value={vh.votehead}
                                        onChange={e => handleVoteheadChange(index, "votehead", e.target.value)}
                                    >
                                        <option value="">Select</option>
                                        {voteheadOptions.map(v => (
                                            <option key={v.id} value={v.id}>{v.name}</option>
                                        ))}
                                    </select>

                                    <Input
                                        type="number"
                                        name="amount"
                                        value={vh.amount}
                                        onChange={e => handleVoteheadChange(index, "amount", e.target.value)}
                                        placeholder="Amount"
                                    />
                                </div>
                            ))}
                            <button type="button" className="text-blue-600 mt-2" onClick={addVotehead}>
                                + Add Votehead
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end mt-6 gap-3">
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <button type="submit" >Save Invoice</button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
