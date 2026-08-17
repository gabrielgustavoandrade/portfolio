import { type CSSProperties, lazy, Suspense } from 'react';
import { BakedSculptures } from './BakedSculptures';
import { Postcard } from './Postcard';
import { useV2Capabilities } from './useV2Capabilities';
import { useV2Motion } from './useV2Motion';
import { WorkPlate } from './WorkPlate';
import './V2Stage.css';

const V2Scene = lazy(() =>
  import('./V2Scene').then((module) => ({ default: module.V2Scene })),
);

export function V2Stage() {
  const { live3d, reducedMotion, ready } = useV2Capabilities();
  const { scroll, look, hover, setHover, workOpen, setWorkOpen, intro } =
    useV2Motion(reducedMotion, ready);

  const typeOpacity = workOpen ? 0 : 1 - scroll * 0.55;
  const veil = (workOpen ? 1 : scroll) * 0.26;

  return (
    <div className={`v2-page${workOpen ? ' is-frame' : ''}`}>
      <div
        className="v2-stage"
        style={
          {
            '--v2-intro': intro,
            '--v2-veil': veil,
          } as CSSProperties
        }
      >
        <div className="v2-sky" />
        <div className="v2-veil" />

        {ready && live3d ? (
          <Suspense fallback={null}>
            <V2Scene
              intro={intro}
              scroll={scroll}
              look={look}
              hover={hover}
              workOpen={workOpen}
              reducedMotion={reducedMotion}
              onHover={(target) => setHover(target)}
            />
          </Suspense>
        ) : ready ? (
          <BakedSculptures
            intro={intro}
            scroll={scroll}
            hover={hover}
            workOpen={workOpen}
            onHover={(target) => setHover(target)}
          />
        ) : null}

        <header className="v2-hero" style={{ opacity: typeOpacity }}>
          <h1 className="v2-hero__name">Gabriel Andrade</h1>
          <p className="v2-hero__line">Commerce, built for speed.</p>
        </header>

        <WorkPlate
          scroll={scroll}
          hover={hover}
          workOpen={workOpen}
          onHover={(active) => setHover(active ? 'work' : null)}
          onOpen={() => setWorkOpen(true)}
        />

        <Postcard
          hover={hover}
          onHover={(active) => setHover(active ? 'postcard' : null)}
        />

        {workOpen ? (
          <button
            type="button"
            className="v2-back"
            onClick={() => setWorkOpen(false)}
          >
            Back
          </button>
        ) : null}
      </div>
      <div className="v2-spacer" aria-hidden="true" />
    </div>
  );
}
