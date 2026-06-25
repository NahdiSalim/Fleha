import { useEffect, useState } from "react";
import Modal from "../ui/modal/Modal";
import { t } from "../../i18n";
import type { TreasuryTransactionType } from "../../types/treasury";

interface TransactionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (params: {
    type: TreasuryTransactionType;
    amount: number;
    user: string;
    beneficiary: string;
    note: string;
  }) => void;
}

export default function TransactionFormModal({
  isOpen,
  onClose,
  onSubmit,
}: TransactionFormModalProps) {
  const [type, setType] = useState<TreasuryTransactionType>("in");
  const [amount, setAmount] = useState("");
  const [user, setUser] = useState("");
  const [beneficiary, setBeneficiary] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setType("in");
      setAmount("");
      setUser("");
      setBeneficiary("");
      setNote("");
      setErrors({});
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors: Record<string, string> = {};
    const parsedAmount = parseFloat(amount);

    if (!user.trim()) nextErrors.user = t("khazina.userRequired");
    if (!beneficiary.trim()) {
      nextErrors.beneficiary = t("khazina.beneficiaryRequired");
    }
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      nextErrors.amount = t("khazina.amountInvalid");
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      type,
      amount: parsedAmount,
      user: user.trim(),
      beneficiary: beneficiary.trim(),
      note: note.trim(),
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("khazina.addTransaction")}
      subtitle={t("khazina.addTransactionSubtitle")}
      size="md"
      footer={
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-white dark:text-gray-300"
          >
            {t("common.cancel")}
          </button>
          <button
            type="submit"
            form="transaction-form"
            className="flex-1 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600"
          >
            {t("common.add")}
          </button>
        </div>
      }
    >
      <form id="transaction-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("khazina.transactionType")}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setType("in")}
              className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                type === "in"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {t("khazina.moneyIn")}
            </button>
            <button
              type="button"
              onClick={() => setType("out")}
              className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                type === "out"
                  ? "border-red-400 bg-red-50 text-red-600"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {t("khazina.moneyOut")}
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="transaction-user"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {t("khazina.user")}
          </label>
          <input
            id="transaction-user"
            type="text"
            value={user}
            onChange={(e) => {
              setUser(e.target.value);
              setErrors((prev) => ({ ...prev, user: "" }));
            }}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
            placeholder={t("khazina.userPlaceholder")}
          />
          {errors.user && (
            <p className="mt-2 text-sm text-red-500">{errors.user}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="transaction-amount"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {t("khazina.amount")}
          </label>
          <input
            id="transaction-amount"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setErrors((prev) => ({ ...prev, amount: "" }));
            }}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
            placeholder="0.00"
          />
          {errors.amount && (
            <p className="mt-2 text-sm text-red-500">{errors.amount}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="transaction-beneficiary"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {t("khazina.beneficiary")}
          </label>
          <input
            id="transaction-beneficiary"
            type="text"
            value={beneficiary}
            onChange={(e) => {
              setBeneficiary(e.target.value);
              setErrors((prev) => ({ ...prev, beneficiary: "" }));
            }}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
            placeholder={t("khazina.beneficiaryPlaceholder")}
          />
          {errors.beneficiary && (
            <p className="mt-2 text-sm text-red-500">{errors.beneficiary}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="transaction-note"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {t("khazina.note")}
          </label>
          <textarea
            id="transaction-note"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
            placeholder={t("khazina.notePlaceholder")}
          />
        </div>
      </form>
    </Modal>
  );
}
