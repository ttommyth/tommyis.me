import { useTranslations } from 'next-intl';
import ColorModelPanel from './ColorModelPanel'; // Assuming it's in the same directory

interface SliderConfig {
  label: string;
  min: number;
  max: number;
  step: number;
  value: string;
  onValueChange: (value: number) => void;
  unit?: string;
  gradientColors: string[];
}

interface ConvertersTabPanelProps {
  t: ReturnType<typeof useTranslations<'ColorSandbox'>>;
  rgbString: string;
  hslString: string;
  oklchString: string;
  handlePreviewClick: (color: string) => void;
  rgbGamutNote?: string | null;
  hslGamutNote?: string | null;
  rgbSliderConfigs: SliderConfig[];
  hslSliderConfigs: SliderConfig[];
  oklchSliderConfigs: SliderConfig[];
  globalPickerColorString: string;
  oklchP3ComparisonColor: string;
  displayP3Color: string;
}

const ConvertersTabPanel: React.FC<ConvertersTabPanelProps> = ({
  t,
  rgbString,
  hslString,
  oklchString,
  handlePreviewClick,
  rgbGamutNote,
  hslGamutNote,
  rgbSliderConfigs,
  hslSliderConfigs,
  oklchSliderConfigs,
  globalPickerColorString,
  oklchP3ComparisonColor,
  displayP3Color,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
      <ColorModelPanel
        title={t('rgbTitle')}
        colorString={rgbString}
        onPreviewClick={handlePreviewClick}
        notes={
          <>
            <p>
              {t.rich('rgbNotes.transitions', {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
            <p>
              {t.rich('rgbNotes.gamut', {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
            <p>
              {t.rich('rgbNotes.use', {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
          </>
        }
        gamutNote={rgbGamutNote}
        sliderConfigs={rgbSliderConfigs}
      />

      <ColorModelPanel
        title={t('hslTitle')}
        colorString={hslString}
        onPreviewClick={handlePreviewClick}
        notes={
          <>
            <p>
              {t.rich('hslNotes.transitions', {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
            <p>
              {t.rich('hslNotes.gamut', {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
            <p>
              {t.rich('hslNotes.use', {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
          </>
        }
        gamutNote={hslGamutNote}
        sliderConfigs={hslSliderConfigs}
      />

      <ColorModelPanel
        title={t('oklchTitle')}
        colorString={oklchString}
        onPreviewClick={handlePreviewClick}
        notes={
          <>
            <p>
              {t.rich('oklchNotes.targetInstruction', {
                swatch: (chunks) => (
                  <span
                    style={{
                      backgroundColor: globalPickerColorString,
                      display: 'inline-block',
                      width: '1em',
                      height: '1em',
                      border: '1px solid currentColor',
                      verticalAlign: 'middle',
                      marginLeft: '0.25em',
                      marginRight: '0.25em',
                    }}
                  />
                ),
              })}
            </p>
            <hr className="my-2 border-gray-300 dark:border-gray-600" />
            <p>
              {t.rich('oklchNotes.transitions', {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
            <p>
              {t.rich('oklchNotes.gamut', {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
            <p>
              {t.rich('oklchNotes.hdrExample', {
                strong: (chunks) => <strong>{chunks}</strong>,
                p3PurpleSpan: (chunks) => (
                  <span
                    style={{
                      color: oklchP3ComparisonColor,
                      fontWeight: 'bold',
                    }}
                  >
                    {chunks}
                  </span>
                ),
                colorString: oklchP3ComparisonColor,
              })}
            </p>
            <p>
              {t.rich('oklchNotes.p3Example', {
                strong: (chunks) => <strong>{chunks}</strong>,
                p3GreenSpan: (chunks) => (
                  <span
                    style={{
                      color: displayP3Color,
                      fontWeight: 'bold',
                    }}
                  >
                    {chunks}
                  </span>
                ),
                code: (chunks) => <code>{chunks}</code>,
                colorString: displayP3Color,
              })}
            </p>
            <p>
              {t.rich('oklchNotes.use', {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
          </>
        }
        sliderConfigs={oklchSliderConfigs}
      />
    </div>
  );
};

export default ConvertersTabPanel;
