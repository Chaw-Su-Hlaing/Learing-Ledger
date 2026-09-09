import type { LanguageDef } from '../lib/constants'
import { Chip } from './Chip'

interface LanguageChipProps {
  language: LanguageDef
  active: boolean
  onClick: () => void
}

export function LanguageChip({ language, active, onClick }: LanguageChipProps) {
  return (
    <Chip active={active} onClick={onClick} accent={language.accent}>
      <span className="lang-code">{language.code}</span> {language.label}
    </Chip>
  )
}
