/**
 * Modal "Reportar Error". Autocontenido: maneja su propio estado de envío y
 * llama al caso de uso `reportarFalla`. App solo controla `open`/`onClose`.
 */
import React, { useState } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import FieldError from '../ui/FieldError';
import { reportarFalla } from '../../core/container';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ErrorReportModal({ open, onClose }: Props) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const close = () => {
    // Reinicia para la próxima apertura.
    setText('');
    setSent(false);
    setSendError(null);
    onClose();
  };

  const submit = async () => {
    if (text.trim().length < 3 || sending) return;
    setSending(true);
    setSendError(null);
    try {
      await reportarFalla(text);
      setSent(true);
      setText('');
    } catch (err) {
      setSendError(err instanceof Error ? err.message : 'No se pudo enviar el reporte. Intenta de nuevo.');
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal open={open} onClose={close} maxWidth="max-w-md" panelClassName="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
          <AlertTriangle size={20} />
        </div>
        <h3 className="text-lg font-bold text-slate-800">Reportar un Error</h3>
      </div>

      {sent ? (
        <div className="text-center py-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-100">
            <CheckCircle size={26} />
          </div>
          <p className="text-sm font-semibold text-slate-800">¡Gracias por tu reporte!</p>
          <p className="text-xs text-slate-500 mt-1">Lo revisaremos pronto.</p>
          <Button variant="primary" accent="slate" onClick={close} className="mt-5">
            Cerrar
          </Button>
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-600 mb-4">
            Describe brevemente el problema que encontraste para que podamos solucionarlo lo antes posible.
          </p>
          <textarea
            maxLength={350}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full border border-slate-200 rounded-xl p-3 text-sm min-h-[100px] focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            placeholder="Ej: La imagen no carga, el botón de enviar no funciona..."
          />
          <p className="text-[10px] text-slate-400 text-right mt-1 tabular-nums">{text.length}/350</p>
          <FieldError message={sendError} />
          <div className="mt-4 flex justify-end gap-3">
            <Button variant="ghost" onClick={close}>
              Cancelar
            </Button>
            <Button variant="primary" accent="amber" onClick={submit} disabled={text.trim().length < 3 || sending}>
              {sending ? 'Enviando…' : 'Enviar Reporte'}
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}
