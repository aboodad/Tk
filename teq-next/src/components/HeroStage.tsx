import type { CSSProperties } from "react";
import { StageParallax } from "@/components/StageParallax";
import { Pic } from "@/components/Pic";
import { Code, Cpu, Database, Globe, Layers, Smartphone, LayoutDashboard } from "lucide-react";

type Props = {
  /** شعار الشركة — يظهر على الوجه الأمامي للمكعب */
  logoUrl: string;
  siteName: string;
  /** صورة الهوية ثلاثية الأبعاد (hero_logo_3d) — اختيارية */
  brandImg?: { src: string; alt: string };
};

/**
 * مشهد ثلاثي الأبعاد بالكامل بـ CSS 3D (بدون مكتبات إضافية):
 * مكعب زجاجي يدور + حلقات مدارية + بطاقات عائمة + نافذة كود،
 * ويتفاعل مع حركة المؤشر (parallax).
 */
export function HeroStage({ logoUrl, siteName, brandImg }: Props) {
  return (
    <StageParallax>
      <div className="tk-stage-inner">
        {/* قرص الضوء تحت المكعب */}
        <span className="tk-disc" aria-hidden />

        {/* حلقات مدارية */}
        <span className="tk-ring" style={{ "--d": "20rem", "--tilt": "72deg", "--t": "16s" } as CSSProperties} aria-hidden />
        <span className="tk-ring tk-ring--rev" style={{ "--d": "26rem", "--tilt": "68deg", "--t": "26s" } as CSSProperties} aria-hidden />
        <span className="tk-ring tk-ring--faint" style={{ "--d": "32rem", "--tilt": "74deg", "--t": "38s" } as CSSProperties} aria-hidden />

        {/* المكعب */}
        <div className="tk-stage-center">
          <div className="tk-cube">
            <span className="tk-core" aria-hidden />
            <div className="tk-face tk-face--f">
              <Pic src={logoUrl} alt={`شعار ${siteName}`} className="tk-face-logo" width={256} height={256} sizes="256px" priority />
            </div>
            <div className="tk-face tk-face--b"><Code className="size-12" strokeWidth={1.5} /></div>
            <div className="tk-face tk-face--r"><Smartphone className="size-12" strokeWidth={1.5} /></div>
            <div className="tk-face tk-face--l"><Globe className="size-12" strokeWidth={1.5} /></div>
            <div className="tk-face tk-face--t"><Cpu className="size-12" strokeWidth={1.5} /></div>
            <div className="tk-face tk-face--d"><Database className="size-12" strokeWidth={1.5} /></div>
          </div>
        </div>

        {/* بطاقات عائمة */}
        <div className="tk-fc" style={{ top: "8%", right: "4%", "--z": "120px", "--del": "0s" } as CSSProperties}>
          <span className="tk-fc-ico"><Smartphone className="size-4" /></span>
          iOS &amp; Android
        </div>
        <div className="tk-fc" style={{ top: "30%", left: "0%", "--z": "150px", "--del": "-2s" } as CSSProperties}>
          <span className="tk-fc-ico"><Globe className="size-4" /></span>
          Web Platforms
        </div>
        <div className="tk-fc" style={{ top: "47%", right: "-1%", "--z": "110px", "--del": "-4s" } as CSSProperties}>
          <span className="tk-fc-ico"><LayoutDashboard className="size-4" /></span>
          UI / UX
        </div>
        <div className="tk-fc" style={{ bottom: "4%", left: "14%", "--z": "90px", "--del": "-1s" } as CSSProperties}>
          <span className="tk-fc-ico"><Layers className="size-4" /></span>
          Custom Systems
        </div>

        {/* نافذة كود */}
        <div className="tk-code" aria-hidden>
          <div className="tk-code-bar">
            <i /><i /><i />
            <span dir="ltr">tekniq.ts</span>
          </div>
          <div className="tk-code-body" dir="ltr">
            <b style={{ width: "46%" }} />
            <b style={{ width: "72%", marginInlineStart: "1rem" }} className="alt" />
            <b style={{ width: "58%", marginInlineStart: "1rem" }} />
            <b style={{ width: "34%", marginInlineStart: "2rem" }} className="alt" />
            <b style={{ width: "64%" }} />
          </div>
        </div>

        {/* بطاقة الهوية (اختيارية) */}
        {brandImg?.src ? (
          <div className="tk-brand-card">
            <Pic src={brandImg.src} alt={brandImg.alt} width={640} height={640} sizes="320px" />
          </div>
        ) : null}
      </div>
    </StageParallax>
  );
}
