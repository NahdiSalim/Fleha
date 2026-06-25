import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import PageMeta from "../../components/common/PageMeta";
import StatCard from "../../components/clients/StatCard";
import AnimatedPage from "../../components/ui/AnimatedPage";
import Modal from "../../components/ui/modal/Modal";
import { usePawn } from "../../context/PawnContext";
import { useTreasury } from "../../context/TreasuryContext";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { BoxCubeIcon, CheckCircleIcon, DollarLineIcon, TimeIcon } from "../../icons";
import { t } from "../../i18n";
import { formatCurrency, formatDate } from "../../utils/format";
import type { PawnRecord } from "../../types/pawn";

const SEARCH_DEBOUNCE_MS = 2000;

export default function Mou3aljaBilRhanPage() {
  const { records, settlePawnRecord } = usePawn();
  const { addTransaction } = useTreasury();

  const [codeQuery, setCodeQuery] = useState("");
  const [recordToSettle, setRecordToSettle] = useState<PawnRecord | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  const debouncedCode = useDebouncedValue(codeQuery, SEARCH_DEBOUNCE_MS);
  const isSearching = codeQuery.trim() !== debouncedCode.trim();

  const filteredRecords = useMemo(() => {
    const query = debouncedCode.trim().toUpperCase();
    if (!query) return records;
    return records.filter((record) => record.code.toUpperCase().includes(query));
  }, [records, debouncedCode]);

  const totalPending = useMemo(
    () =>
      Math.round(
        filteredRecords.reduce((sum, record) => sum + record.packDepositTotal, 0) * 100
      ) / 100,
    [filteredRecords]
  );

  const handleConfirmSettle = () => {
    if (!recordToSettle) return;

    const settled = settlePawnRecord(recordToSettle.id);
    if (!settled) return;

    addTransaction({
      type: "out",
      amount: settled.packDepositTotal,
      user: t("pawn.systemUser"),
      beneficiary: settled.clientName,
      note: t("pawn.refundNote", {
        code: settled.code,
        invoiceId: settled.invoiceId,
      }),
      source: "pawn",
    });

    setSuccessMsg(
      t("pawn.settledSuccess", {
        code: settled.code,
        amount: formatCurrency(settled.packDepositTotal),
      })
    );
    window.setTimeout(() => setSuccessMsg(""), 4000);
    setRecordToSettle(null);
  };

  return (
    <>
      <PageMeta title={t("meta.pawn")} description={t("pawn.subtitle")} />
      <AnimatedPage>
        <div className="mb-6">
          <motion.h1
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl"
          >
            {t("pawn.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-1 text-sm text-gray-500 dark:text-gray-400"
          >
            {t("pawn.subtitle")}
          </motion.p>
        </div>

        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
          >
            {successMsg}
          </motion.div>
        )}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            label={t("pawn.activeRecords")}
            value={String(filteredRecords.length)}
            icon={<TimeIcon className="h-5 w-5" />}
            accent="primary"
            delay={0}
          />
          <StatCard
            label={t("pawn.pendingRefund")}
            value={formatCurrency(totalPending)}
            icon={<DollarLineIcon className="h-5 w-5" />}
            accent="accent"
            delay={0.05}
          />
          <StatCard
            label={t("pawn.packLines")}
            value={String(filteredRecords.reduce((sum, record) => sum + record.lines.length, 0))}
            icon={<BoxCubeIcon className="h-5 w-5" />}
            accent="primary"
            delay={0.1}
          />
        </div>

        <div className="mb-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <label className="mb-2 block text-sm font-semibold text-gray-800 dark:text-gray-200">
            {t("pawn.searchByCode")}
          </label>
          <input
            type="text"
            value={codeQuery}
            onChange={(event) => setCodeQuery(event.target.value.toUpperCase())}
            placeholder={t("pawn.codePlaceholder")}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 font-mono text-sm uppercase outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          {isSearching && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {t("pawn.searching")}
            </p>
          )}
        </div>

        {filteredRecords.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 dark:border-gray-700 dark:bg-gray-900"
          >
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              {t("pawn.noRecords")}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t("pawn.noRecordsHint")}
            </p>
          </motion.div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="hidden overflow-x-auto md:block">
              <table className="falah-table min-w-[900px] text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gradient-to-r from-brand-500/5 to-falah-accent/5 dark:border-gray-800 dark:from-brand-500/15 dark:to-falah-accent/15">
                    <th className="px-6 py-4 font-semibold text-gray-700 dark:text-white">
                      {t("pawn.code")}
                    </th>
                    <th className="px-6 py-4 font-semibold text-gray-700 dark:text-white">
                      {t("common.date")}
                    </th>
                    <th className="px-6 py-4 font-semibold text-gray-700 dark:text-white">
                      {t("sell.client")}
                    </th>
                    <th className="px-6 py-4 font-semibold text-gray-700 dark:text-white">
                      {t("common.invoice")}
                    </th>
                    <th className="px-6 py-4 font-semibold text-gray-700 dark:text-white">
                      {t("pawn.refundAmount")}
                    </th>
                    <th className="px-6 py-4 text-end font-semibold text-gray-700 dark:text-white">
                      {t("common.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record, index) => (
                    <motion.tr
                      key={record.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b border-gray-50 hover:bg-brand-50/30 dark:border-gray-800 dark:hover:bg-gray-800/60"
                    >
                      <td className="px-6 py-4 font-mono text-sm font-bold text-brand-700 dark:text-brand-300">
                        {record.code}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-200">
                        {formatDate(record.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white">
                        {record.clientName}
                      </td>
                      <td className="px-6 py-4 font-mono text-sm text-gray-700 dark:text-gray-200">
                        {record.invoiceId}
                      </td>
                      <td className="px-6 py-4 font-semibold text-brand-600">
                        {formatCurrency(record.packDepositTotal)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => setRecordToSettle(record)}
                            className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-brand-500 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-brand-600"
                          >
                            <CheckCircleIcon className="action-icon" />
                            <span>{t("pawn.returnPacks")}</span>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-4 p-4 md:hidden">
              {filteredRecords.map((record, index) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/40"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-sm font-bold text-brand-700 dark:text-brand-300">
                        {record.code}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {record.clientName} · {record.invoiceId}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRecordToSettle(record)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-500 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-brand-600"
                    >
                      <CheckCircleIcon className="action-icon" />
                      <span>{t("pawn.returnPacks")}</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t("common.date")}
                      </p>
                      <p className="mt-1 font-medium text-gray-900 dark:text-white">
                        {formatDate(record.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t("pawn.refundAmount")}
                      </p>
                      <p className="mt-1 font-semibold text-brand-600">
                        {formatCurrency(record.packDepositTotal)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </AnimatedPage>

      <Modal
        isOpen={!!recordToSettle}
        onClose={() => setRecordToSettle(null)}
        title={t("pawn.returnPacks")}
        subtitle={
          recordToSettle
            ? t("pawn.settleSubtitle", {
                code: recordToSettle.code,
                client: recordToSettle.clientName,
              })
            : undefined
        }
        size="md"
        footer={
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setRecordToSettle(null)}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-white dark:text-gray-300"
            >
              {t("common.cancel")}
            </button>
            <button
              type="button"
              onClick={handleConfirmSettle}
              className="flex-1 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600"
            >
              {t("pawn.confirmReturn")}
            </button>
          </div>
        }
      >
        {recordToSettle && (
          <div className="space-y-4">
            <div className="rounded-xl border border-brand-100 bg-brand-50/60 p-4 text-center dark:border-brand-500/20 dark:bg-brand-500/10">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t("pawn.refundAmount")}
              </p>
              <p className="mt-1 text-2xl font-bold text-brand-600">
                {formatCurrency(recordToSettle.packDepositTotal)}
              </p>
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
              <table className="falah-table w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/80 dark:border-gray-800 dark:bg-gray-800/50">
                    <th className="px-4 py-3 text-start font-semibold text-gray-700 dark:text-white">
                      {t("common.product")}
                    </th>
                    <th className="px-4 py-3 text-start font-semibold text-gray-700 dark:text-white">
                      {t("common.pack")}
                    </th>
                    <th className="px-4 py-3 text-start font-semibold text-gray-700 dark:text-white">
                      {t("common.quantity")}
                    </th>
                    <th className="px-4 py-3 text-start font-semibold text-gray-700 dark:text-white">
                      {t("common.total")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recordToSettle.lines.map((line) => (
                    <tr
                      key={`${line.productName}-${line.packName}-${line.quantity}`}
                      className="border-b border-gray-50 last:border-0 dark:border-gray-800"
                    >
                      <td className="px-4 py-3 text-gray-900 dark:text-white">
                        {line.productName}
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                        {line.packName}
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                        {line.quantity}
                      </td>
                      <td className="px-4 py-3 font-semibold text-brand-600">
                        {formatCurrency(line.linePackTotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
