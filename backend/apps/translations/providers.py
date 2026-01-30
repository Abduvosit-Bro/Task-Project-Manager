import logging
from dataclasses import dataclass
from typing import Optional
import requests
from django.conf import settings
from deep_translator import GoogleTranslator

logger = logging.getLogger(__name__)


@dataclass
class TranslationResult:
    text: Optional[str]
    provider: str


class LocalTranslator:
    name = 'local'

    def translate(self, source_lang: str, target_lang: str, text: str) -> TranslationResult:
        if not text:
            return TranslationResult(text=None, provider=self.name)
        prefix = '[UZ] ' if target_lang == 'uz' else '[JA] '
        return TranslationResult(text=f'{prefix}{text}', provider=self.name)


class GoogleTranslatorProvider:
    name = 'google-free'

    def translate(self, source_lang: str, target_lang: str, text: str) -> TranslationResult:
        if not text:
            return TranslationResult(text=None, provider=self.name)
        try:
            # deep_translator uses 'ja', 'uz', etc. standard codes.
            translator = GoogleTranslator(source=source_lang, target=target_lang)
            translated = translator.translate(text)
            return TranslationResult(text=translated, provider=self.name)
        except Exception as exc:
            logger.warning('Google translation failed: %s', exc)
            return TranslationResult(text=None, provider=self.name)


class OpenAITranslator:
    name = 'openai'

    def __init__(self, api_key: str):
        self.api_key = api_key

    def translate(self, source_lang: str, target_lang: str, text: str) -> TranslationResult:
        if not text:
            return TranslationResult(text=None, provider=self.name)
        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json',
        }
        payload = {
            'model': 'gpt-4o-mini',
            'messages': [
                {
                    'role': 'system',
                    'content': 'You are a translation engine. Return only the translated text.',
                },
                {
                    'role': 'user',
                    'content': f'Translate from {source_lang} to {target_lang}: {text}',
                },
            ],
            'temperature': 0.2,
        }
        try:
            resp = requests.post('https://api.openai.com/v1/chat/completions', json=payload, headers=headers, timeout=15)
            resp.raise_for_status()
            data = resp.json()
            translated = data['choices'][0]['message']['content'].strip()
            return TranslationResult(text=translated, provider=self.name)
        except Exception as exc:
            logger.warning('OpenAI translation failed: %s', exc)
            return TranslationResult(text=None, provider=self.name)


def get_default_translator():
    if settings.OPENAI_API_KEY:
        return OpenAITranslator(settings.OPENAI_API_KEY)
    # Use Google Translate as a free "AI" alternative
    return GoogleTranslatorProvider()
