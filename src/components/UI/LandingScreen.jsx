import { CADUTopBar } from './CADUTopBar'
import { LandingDockMenu } from './LandingDockMenu'
import { TemplateParallaxScene } from './TemplateParallaxScene'
import './cadu-ui.css'
import './landing.css'

/** Entrada: cena por camadas + nav funcional (clone do HUD). */
export function LandingScreen() {
  return (
    <div className="cadu-landing">
      <CADUTopBar variant="landing" />
      <div className="cadu-landing__scene">
        <TemplateParallaxScene />
      </div>
      <LandingDockMenu />
    </div>
  )
}
