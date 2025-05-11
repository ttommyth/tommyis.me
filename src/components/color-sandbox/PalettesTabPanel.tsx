import { useTranslations } from 'next-intl';
import ColorPaletteDisplay from './ColorPaletteDisplay';

interface PalettesTabPanelProps {
  t: ReturnType<typeof useTranslations<'ColorSandbox'>>;
  paletteSteps: number;
  setPaletteSteps: (value: number) => void;
  tints: string[];
  shades: string[];
  tones: string[];
  handlePreviewClick: (color: string) => void;
}

const PalettesTabPanel: React.FC<PalettesTabPanelProps> = ({
  t,
  paletteSteps,
  setPaletteSteps,
  tints,
  shades,
  tones,
  handlePreviewClick,
}) => {
  return (
    <>
      <div className="mb-4 flex items-center space-x-3">
        <label
          htmlFor="paletteStepsInput"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {t('palette.stepsLabel')}
        </label>
        <input
          type="range"
          id="paletteStepsInput"
          name="paletteStepsInput"
          value={paletteSteps}
          onChange={(e) => setPaletteSteps(parseInt(e.target.value, 10))}
          className="mt-1 block w-48 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 h-2 accent-indigo-600 dark:accent-indigo-400"
          min="3"
          max="20"
        />
        <span className="text-sm text-gray-600 dark:text-gray-400 w-6 text-right">
          {paletteSteps}
        </span>
      </div>
      <div>
        <ColorPaletteDisplay
          title={t('palette.tints')}
          colors={tints}
          onPreviewClick={handlePreviewClick}
        />
        <ColorPaletteDisplay
          title={t('palette.shades')}
          colors={shades}
          onPreviewClick={handlePreviewClick}
        />
        <ColorPaletteDisplay
          title={t('palette.tones')}
          colors={tones}
          onPreviewClick={handlePreviewClick}
        />
      </div>
    </>
  );
};

export default PalettesTabPanel;
