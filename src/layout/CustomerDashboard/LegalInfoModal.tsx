import { X } from "lucide-react";

interface LegalInfoModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  content: string[];
}

const LegalInfoModal = ({
  open,
  onClose,
  title,
  subtitle,
  content,
}: LegalInfoModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 !mt-0">
      <div className="bg-theme-surface border border-theme-border rounded-2xl w-full max-w-3xl">

        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-theme-border">
          <div>
            <h2 className="font-playfair text-3xl text-theme-text">
              {title}
            </h2>

            <p className="text-theme-muted mt-2 max-w-2xl">
              {subtitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-theme-muted hover:text-theme-text"
          >
            <X size={22} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="max-h-[60vh] overflow-y-auto px-6 py-5 space-y-6 custom-scrollbar">
          {content.map((item, index) => (
            <div key={index}>
              <h4 className="text-[#00C950] font-semibold mb-2">
                {index + 1}. Section {index + 1}
              </h4>

              <p className="text-theme-text leading-8 text-[15px]">
                {item}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-theme-border p-5 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#009966] hover:bg-[#00b377] text-white px-6 py-2 rounded-lg"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalInfoModal;