import { useTranslations } from 'next-intl';
import ColorPaletteDisplay from './ColorPaletteDisplay';

interface HarmoniesTabPanelProps {
  t: ReturnType<typeof useTranslations<'ColorSandbox'>>;
  complementaryHarmony: string[];
  triadicHarmony: string[];
  analogousHarmony: string[];
  tetradicHarmony: string[];
  splitComplementaryHarmony: string[];
  handlePreviewClick: (color: string) => void;
  analogousAngle: number;
  setAnalogousAngle: (value: number) => void;
  tetradicAngle: number;
  setTetradicAngle: (value: number) => void;
  splitComplementaryAngle: number;
  setSplitComplementaryAngle: (value: number) => void;
}

const HarmoniesTabPanel: React.FC<HarmoniesTabPanelProps> = ({
  t,
  complementaryHarmony,
  triadicHarmony,
  analogousHarmony,
  tetradicHarmony,
  splitComplementaryHarmony,
  handlePreviewClick,
  analogousAngle,
  setAnalogousAngle,
  tetradicAngle,
  setTetradicAngle,
  splitComplementaryAngle,
  setSplitComplementaryAngle,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      <ColorPaletteDisplay
        title={t('harmony.complementary')}
        colors={complementaryHarmony}
        onPreviewClick={handlePreviewClick}
      />
      <ColorPaletteDisplay
        title={t('harmony.triadic')}
        colors={triadicHarmony}
        onPreviewClick={handlePreviewClick}
      />

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700 md:border-t-0 md:pt-0">
        <ColorPaletteDisplay
          title={t('harmony.analogous')}
          colors={analogousHarmony}
          onPreviewClick={handlePreviewClick}
          controls={
            <div className="mb-2 space-y-1">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="analogousAngleInput"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {t('harmony.analogousAngleLabel')}
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-8 text-right">
                    {analogousAngle}°
                  </span>
                  <button
                    onClick={() => setAnalogousAngle(30)}
                    title={
                      t('harmony.resetAngleTooltip') || 'Reset angle to 30°'
                    }
                    className="p-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    &#x21BA;
                  </button>
                </div>
              </div>
              <input
                type="range"
                id="analogousAngleInput"
                value={analogousAngle}
                onChange={(e) =>
                  setAnalogousAngle(parseInt(e.target.value, 10))
                }
                className="w-full h-2 p-0 accent-indigo-600 dark:accent-indigo-400 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                min="10"
                max="60"
              />
            </div>
          }
        />
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700 md:border-t-0 md:pt-0">
        <ColorPaletteDisplay
          title={t('harmony.tetradic')}
          colors={tetradicHarmony}
          onPreviewClick={handlePreviewClick}
          controls={
            <div className="mb-2 space-y-1">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="tetradicAngleInput"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {t('harmony.tetradicAngleLabel')}
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-8 text-right">
                    {tetradicAngle}°
                  </span>
                  <button
                    onClick={() => setTetradicAngle(60)}
                    title={
                      t('harmony.resetAngleTooltip') || 'Reset angle to default'
                    }
                    className="p-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    &#x21BA;
                  </button>
                </div>
              </div>
              <input
                type="range"
                id="tetradicAngleInput"
                value={tetradicAngle}
                onChange={(e) => setTetradicAngle(parseInt(e.target.value, 10))}
                className="w-full h-2  p-0 accent-indigo-600 dark:accent-indigo-400 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                min="30"
                max="90"
              />
            </div>
          }
        />
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700 md:border-t-0 md:pt-0">
        <ColorPaletteDisplay
          title={t('harmony.splitComplementary')}
          colors={splitComplementaryHarmony}
          onPreviewClick={handlePreviewClick}
          controls={
            <div className="mb-2 space-y-1">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="splitComplementaryAngleInput"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {t('harmony.splitComplementaryAngleLabel')}
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-8 text-right">
                    {splitComplementaryAngle}°
                  </span>
                  <button
                    onClick={() => setSplitComplementaryAngle(30)}
                    title={
                      t('harmony.resetAngleTooltip') || 'Reset angle to default'
                    }
                    className="p-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    &#x21BA;
                  </button>
                </div>
              </div>
              <input
                type="range"
                id="splitComplementaryAngleInput"
                value={splitComplementaryAngle}
                onChange={(e) =>
                  setSplitComplementaryAngle(parseInt(e.target.value, 10))
                }
                className="w-full h-2 p-0 accent-indigo-600 dark:accent-indigo-400 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                min="10"
                max="60"
              />
            </div>
          }
        />
      </div>
    </div>
  );
};

export default HarmoniesTabPanel;
