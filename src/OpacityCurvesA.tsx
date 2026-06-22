import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {OPACITY_CURVES_A, OpacityCurve} from './effects/opacityCurves';

/**
 * A 类：透明度 · 多项式与指数曲线（方法 1–10）的预览合成。
 *
 * 10 个单元格同步播放，便于横向对比不同曲线的"出现节奏"。
 * 每个循环：前 REVEAL 帧做淡入，HOLD 帧停留，再整体复位循环。
 */

const REVEAL = 45; // 淡入所占帧数
const HOLD = 30; // 完全显示后的停留帧数
const CYCLE = REVEAL + HOLD + 15; // 一个完整循环的帧数（末段为复位间隔）

const SAMPLE_TEXT = 'Aa 字体';

const Cell: React.FC<{curve: OpacityCurve; t: number}> = ({curve, t}) => {
  const style = curve.apply(t);
  return (
    <div
      style={{
        position: 'relative',
        flex: '0 0 18%',
        height: 380,
        margin: '0 1% 24px',
        borderRadius: 18,
        background: 'linear-gradient(160deg, #16213e 0%, #0f1626 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '20px 18px',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <div style={{color: '#9aa7c7', fontFamily: 'monospace', fontSize: 18}}>
        <span style={{color: '#e94560', fontWeight: 700}}>{String(curve.id).padStart(2, '0')}</span>{' '}
        {curve.name}
        <div style={{fontSize: 13, color: '#5f6b8a', marginTop: 2}}>{curve.enName}</div>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: '#f5f7ff',
            fontFamily: 'Arial, "PingFang SC", "Noto Sans CJK SC", sans-serif',
            opacity: style.opacity,
            transform: style.transform ?? 'none',
            filter: style.filter ?? 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {SAMPLE_TEXT}
        </div>
      </div>

      <div>
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: 14,
            color: '#7fd1c0',
            marginBottom: 8,
            minHeight: 18,
          }}
        >
          {curve.formula}
        </div>
        {/* 进度条：直观显示该曲线在当前 t 的输出 opacity */}
        <div style={{height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.08)'}}>
          <div
            style={{
              height: '100%',
              width: `${style.opacity * 100}%`,
              borderRadius: 3,
              background: 'linear-gradient(90deg,#e94560,#f7b733)',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export const OpacityCurvesA: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  // 在整段时长内循环播放淡入过程，便于在 Studio 中直接观察。
  const local = frame % CYCLE;
  const t = Math.max(0, Math.min(1, local / REVEAL));

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0b1020',
        flexDirection: 'column',
        padding: '48px 40px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{marginBottom: 28}}>
        <div
          style={{
            color: '#f5f7ff',
            fontSize: 40,
            fontWeight: 800,
            fontFamily: 'Arial, "PingFang SC", sans-serif',
          }}
        >
          A 类 · 透明度 — 多项式与指数曲线（1–10）
        </div>
        <div style={{color: '#6b779b', fontSize: 18, marginTop: 6, fontFamily: 'monospace'}}>
          归一化进度 t = {t.toFixed(2)} ｜ 循环 {CYCLE} 帧 ｜ 总时长 {durationInFrames} 帧
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignContent: 'flex-start',
          justifyContent: 'center',
        }}
      >
        {OPACITY_CURVES_A.map((curve) => (
          <Cell key={curve.id} curve={curve} t={t} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
