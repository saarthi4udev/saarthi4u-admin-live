
const ConfirmModal = ({ setShowModal, handleCreate }: any) => {
    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <div className="admin-modal-card p-5 sm:p-6">
                    <h3 className="text-xl font-semibold text-black dark:text-white">Confirmation</h3>
                    <p className="mt-2 text-sm text-body">Are you sure you want to continue with this action?</p>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            className="admin-btn-outline"
                            onClick={() => setShowModal(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="admin-btn-primary"
                            onClick={handleCreate}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
            <div className="admin-modal-overlay"></div>
        </>
    )
}

export default ConfirmModal