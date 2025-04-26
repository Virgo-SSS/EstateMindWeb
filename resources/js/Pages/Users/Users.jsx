import { CopyPlus, LoaderCircle, Pencil, Trash2 } from "lucide-react";
import Button from "../../components/ui/button/Button";
import AppLayout from "../../layout/AppLayout";
import { Link, useForm } from "@inertiajs/react";
import Table from "../../components/ui/table/Table";
import TableHeaderCell from "../../components/ui/table/TableHeaderCell";
import TableDataCell from "../../components/ui/table/TableDataCell";
import TableCard from "../../components/ui/table/TableCard";
import TableCardBody from "../../components/ui/table/TableCardBody";
import TableHeader from "../../components/ui/table/TableHeader";
import EmptyTableRow from "../../components/ui/table/EmptyTableRow";
import WarningModal from "../../components/ui/modal/WarningModal";
import { useModal } from "../../hooks/useModal";
import { useCallback, useMemo } from "react";

export default function Users({ users }) {
	const { isOpen, openModal, closeModal } = useModal()
	const deleteForm = useForm({
		user: null,
	});

	const confirmDelete = useCallback((user) => {
		deleteForm.setData("user", user);
		openModal();
	}, [deleteForm, openModal]);

	const handleDelete = useCallback((e) => {
		e.preventDefault();

		if (!deleteForm.data.user?.id) {
			// TODO: Handle error case (e.g., show a toast notification)
			console.error("No user selected for deletion.");
			closeModal();
			return;
		}

		deleteForm.delete(route("users.destroy", deleteForm.data.user.id), {
			onSuccess: () => {
				closeModal();
				deleteForm.reset();
			},
			onError: (errors) => {
				// TODO: Handle error case (e.g., show a toast notification)
				console.error("Failed to delete user:", errors);
			}
		});
	}, [deleteForm, closeModal]);

	const tableHeaders = [
		{ name: "No.", key: "no" },
		{ name: "Name", key: "name" },
		{ name: "Email", key: "email" },
		{ name: "Role", key: "role" },
		{ name: "Actions", key: "actions" },
	];

	const hasUsers = useMemo(() => users.length > 0, [users]);

	return (
		<>
			<AppLayout>
				<div className="flex flex-wrap items-center justify-between gap-3 mb-6">
					<h2
						className="text-xl font-semibold text-gray-800 dark:text-white/90"
					>
						Users
					</h2>
					<Link href={route("users.create")}>
						<Button
							size="xs"
							startIcon={<CopyPlus className="w-4 h-4 mr-2" />}
						>
							New User
						</Button>
					</Link>
				</div>

				<div className="space-y-6">
					<TableCard>
						<TableCardBody>
							<Table>
								<TableHeader>
									<tr>
										{tableHeaders.map((header) => (
											<TableHeaderCell key={header.key}>
												{header.name}
											</TableHeaderCell>
										))}
									</tr>
								</TableHeader>
								<tbody>
									{
										hasUsers ? (
											users.map((user, index) => (
												<tr key={user.id}>
													<TableDataCell>{index + 1}</TableDataCell>
													<TableDataCell>{user.name}</TableDataCell>
													<TableDataCell>{user.email}</TableDataCell>
													<TableDataCell>
														{user.role === 1 ? "Super Admin" : "Admin"}
													</TableDataCell>
													<TableDataCell>
														<Link href={route("users.edit", user.id)}>
															<button className="text-blue-500 hover:text-blue-700">
																<Pencil className="w-4.5 h-4.5 mr-2" />
															</button>
														</Link>
														{
															user.role !== 1 && (
																<>
																	<span className="mx-2">
																		|
																	</span>
																	<button
																		type="button"
																		aria-label={`Delete ${user.name}`}
																		onClick={() => confirmDelete(user)}
																		disabled={deleteForm.processing}
																		className="text-red-500 hover:text-red-700">
																		<Trash2 className="w-4.5 h-4.5 ml-2 cursor-pointer " />
																	</button>
																</>
															)
														}
													</TableDataCell>
												</tr>
											))
										) : (
											<EmptyTableRow message="No users found." />
										)
									}
								</tbody>
							</Table>
						</TableCardBody>
					</TableCard>
				</div>
			</AppLayout>

			<WarningModal
				isOpen={isOpen}
				onClose={closeModal}
				title={`Delete ${deleteForm.data.user?.name} user`}
				message={`Are you sure you want to delete ${deleteForm.data.user?.name} user? This action cannot be undone.`}
				confirmButton={
					<Button
						size="sm"
						disabled={deleteForm.processing}
						onClick={handleDelete}
						className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white rounded-lg bg-warning-500 shadow-theme-xs hover:bg-warning-600 sm:w-auto"
					>
						{deleteForm.processing && <LoaderCircle className="w-5 h-5 mr-0.5 text-white animate-spin" />}
						Delete user
					</Button>
				}
				cancelButton={
					<Button
						type="button"
						onClick={closeModal}
						size="sm"
						disabled={deleteForm.processing}
						className="flex justify-center w-full px-4 py-3 text-sm font-medium text-gray-700 rounded-lg bg-gray-500 shadow-theme-xs hover:bg-gray-700 sm:w-auto"
					>
						Cancel
					</Button>
				}
			/>
		</>
	);
}
