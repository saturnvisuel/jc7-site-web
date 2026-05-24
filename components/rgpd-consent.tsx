"use client";

import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface RGPDConsentProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  error?: string;
}

export function RGPDConsent({ checked, onCheckedChange, error }: RGPDConsentProps) {
  return (
    <div className="space-y-3">
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
        <h3 className="font-semibold text-blue-900 mb-2">
          Protection de vos données personnelles
        </h3>
        <p className="text-sm text-blue-800 mb-3">
          Conformément au RGPD, vos données sont collectées uniquement pour la gestion de votre inscription 
          et ne seront jamais vendues ou transmises à des tiers à des fins commerciales.
        </p>
        <div className="text-sm text-blue-800 space-y-1">
          <p>
            <strong>Vos droits :</strong> Accès, rectification, suppression, portabilité de vos données.
          </p>
          <p>
            <strong>Contact :</strong> judo.courneuve93@gmail.com
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-3">
        <Checkbox
          id="rgpd-consent"
          checked={checked}
          onCheckedChange={onCheckedChange}
          className="mt-1"
        />
        <div className="flex-1">
          <Label
            htmlFor="rgpd-consent"
            className="text-sm font-normal cursor-pointer leading-relaxed"
          >
            J'accepte que mes données personnelles soient collectées et traitées par JC7 pour la gestion 
            de mon inscription, conformément à la{" "}
            <Link
              href="/politique-confidentialite"
              target="_blank"
              className="text-primary hover:underline font-semibold"
            >
              politique de confidentialité
            </Link>
            . Je reconnais disposer d'un droit d'accès, de rectification et de suppression de mes données 
            en contactant le club. *
          </Label>
          {error && (
            <p className="text-sm text-destructive mt-1">{error}</p>
          )}
        </div>
      </div>

      <div className="text-xs text-muted-foreground space-y-1 pl-7">
        <p>
          • Vos données sont stockées de manière sécurisée dans l'Union Européenne
        </p>
        <p>
          • Vous pouvez exercer vos droits à tout moment en nous contactant
        </p>
        <p>
          • Consultez notre{" "}
          <Link href="/politique-confidentialite" target="_blank" className="text-primary hover:underline">
            politique de confidentialité
          </Link>
          {" "}et nos{" "}
          <Link href="/mentions-legales" target="_blank" className="text-primary hover:underline">
            mentions légales
          </Link>
        </p>
      </div>
    </div>
  );
}
