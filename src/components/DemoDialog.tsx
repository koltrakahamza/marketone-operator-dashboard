import { Check, CircleAlert, Clock3, PackageOpen } from 'lucide-react';
import { Modal } from './Modal';
import type { DemoMode } from '../types';

const scenarios = [
  {
    mode: 'normal',
    icon: Check,
    title: 'Katalogu i plotë',
    description: 'Eksploroni produktet dhe krijoni porosi.',
  },
  {
    mode: 'loading',
    icon: Clock3,
    title: 'Ngarkim i ngadaltë',
    description: 'Shikoni gjendjen e ngarkimit për 8 sekonda.',
  },
  {
    mode: 'error',
    icon: CircleAlert,
    title: 'Gabim në ngarkim',
    description: 'Provoni mesazhin e gabimit dhe riprovimin.',
  },
  {
    mode: 'empty',
    icon: PackageOpen,
    title: 'Katalog bosh',
    description: 'Shikoni pamjen kur nuk ka produkte.',
  },
] as const;

export function DemoDialog({
  mode,
  onMode,
  onClose,
}: {
  mode: DemoMode;
  onMode: (mode: DemoMode) => void;
  onClose: () => void;
}) {
  return (
    <Modal title="Eksploroni demonstrimin" onClose={onClose}>
      <p className="modal-intro">
        MarketOne është një prototip funksional. Të gjitha produktet, llogaria dhe porositë janë të
        dhëna demo.
      </p>
      <div className="demo-scenarios">
        {scenarios.map((item) => (
          <button
            key={item.mode}
            className={mode === item.mode ? 'selected' : ''}
            aria-pressed={mode === item.mode}
            onClick={() => {
              onMode(item.mode);
              onClose();
            }}
          >
            <span>
              <item.icon size={21} />
            </span>
            <div>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </div>
            {mode === item.mode && <Check size={17} />}
          </button>
        ))}
      </div>
      <p className="demo-dialog-note">
        Shporta ruhet gjatë rifreskimit në këtë skedë. Dalja nga llogaria e pastron atë. Skenarët e
        demonstrimit nuk e ndryshojnë stokun real.
      </p>
    </Modal>
  );
}
