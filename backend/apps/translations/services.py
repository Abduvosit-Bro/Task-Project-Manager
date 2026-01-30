import hashlib
import logging
from typing import Dict, Tuple
from django.db import transaction

from .providers import get_default_translator, LocalTranslator
from .models import TranslationLog

logger = logging.getLogger(__name__)


class TranslationService:
    def __init__(self):
        self.translator = get_default_translator()

    def translate(self, source_lang: str, target_lang: str, text: str) -> Tuple[str, str]:
        result = self.translator.translate(source_lang, target_lang, text)
        if result.text is None:
            if not isinstance(self.translator, LocalTranslator):
                local = LocalTranslator()
                local_result = local.translate(source_lang, target_lang, text)
                return local_result.text or text, local_result.provider
            return text, self.translator.name
        return result.text, result.provider

    def fill_missing(self, data: Dict[str, str], entity_type: str, entity_id: str = 'pending') -> Dict[str, str]:
        field_pairs = [
            ('name_ja', 'name_uz'),
            ('title_ja', 'title_uz'),
            ('description_ja', 'description_uz'),
        ]
        for ja_field, uz_field in field_pairs:
            if ja_field in data or uz_field in data:
                ja_val = data.get(ja_field)
                uz_val = data.get(uz_field)
                if ja_val and not uz_val:
                    translated, provider = self.translate('ja', 'uz', ja_val)
                    data[uz_field] = translated
                    self._log(entity_type, entity_id, 'ja', 'uz', ja_val, translated, provider)
                elif uz_val and not ja_val:
                    translated, provider = self.translate('uz', 'ja', uz_val)
                    data[ja_field] = translated
                    self._log(entity_type, entity_id, 'uz', 'ja', uz_val, translated, provider)
        return data

    @transaction.atomic
    def _log(self, entity_type: str, entity_id: str, source_lang: str, target_lang: str, source_text: str, translated_text: str, provider: str) -> None:
        if not source_text or not translated_text:
            return
        source_hash = hashlib.sha256(source_text.encode('utf-8')).hexdigest()
        TranslationLog.objects.create(
            entity_type=entity_type,
            entity_id=str(entity_id),
            source_lang=source_lang,
            target_lang=target_lang,
            provider=provider,
            source_hash=source_hash,
            translated_text=translated_text,
        )
        logger.info('Translation logged for %s %s', entity_type, entity_id)
