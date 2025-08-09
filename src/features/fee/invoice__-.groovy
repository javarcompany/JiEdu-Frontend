// Check if all students have same course/module
                const firstCourse = selectedStudents[0].course;
                const firstModule = selectedStudents[0].module;
                const sameCourseModule = selectedStudents.every(
                    s => s.course === firstCourse && s.module === firstModule
                );

                if (sameCourseModule) {
                    // 4️⃣ Ask backend if fee structure exists for course/module
                    const { data: feeCheck } = await axios.post(
                        "/api/check-fee-structure/", 
                        {},
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                            params: {course_id: firstCourse, module_id: firstModule,},
                        }
                    );

                    if (feeCheck) {
                        // 5️⃣ Ask backend if invoice matches fee structure for student(s)
                        const { data: matchCheck } = await axios.post(
                            "/api/check-invoice-match/", 
                            {student_ids: selectedStudents.map(s => s.id), voteheads: selectedVoteheads.map(vh => vh.votehead)},
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );

                        if (matchCheck.allMatch) {
                            Swal.fire(
                                "Info",
                                "The fee structure exists and all selected students already have matching invoices.",
                                "info"
                            );
                            return; // Abort process
                        }

                        // 6️⃣ Ask user if they want to override
                        const result = await Swal.fire({
                            title: "Fee structure exists",
                            text: "Would you like to override entered data with the existing fee structure?",
                            icon: "question",
                            showCancelButton: true,
                            confirmButtonText: "Override",
                            cancelButtonText: "Use entered data",
                        });

                        if (result.isConfirmed) {
                            await axios.post("/api/apply-structure-as-invoice/", {
                                target_type: targetType,
                                student_ids: selectedStudents.map(s => s.id),
                            });
                        } else {
                            await axios.post("/api/create-invoice/", {
                                target_type: targetType,
                                voteheads: selectedVoteheads,
                                student_ids: selectedStudents.map(s => s.id),
                                apply_as_structure: false,
                            });
                        }
                    } else {
                        // No fee structure exists, create invoice using entered data
                        await axios.post("/api/create-invoice/", {
                            target_type: targetType,
                            voteheads: selectedVoteheads,
                            student_ids: selectedStudents.map(s => s.id),
                            apply_as_structure: false,
                        });
                    }
                } else {
                    // Students have different course/module — just apply input data
                    await axios.post("/api/create-invoice/", {
                        target_type: targetType,
                        voteheads: selectedVoteheads,
                        student_ids: selectedStudents.map(s => s.id),
                        apply_as_structure: false,
                    });
                }