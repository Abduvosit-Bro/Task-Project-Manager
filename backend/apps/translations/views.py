from rest_framework import serializers, views, permissions
from rest_framework.response import Response
from .services import TranslationService


class TranslateSerializer(serializers.Serializer):
    source_lang = serializers.ChoiceField(choices=['ja', 'uz'])
    target_lang = serializers.ChoiceField(choices=['ja', 'uz'])
    text = serializers.CharField()


class TranslateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = TranslateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        service = TranslationService()
        translated, provider = service.translate(
            serializer.validated_data['source_lang'],
            serializer.validated_data['target_lang'],
            serializer.validated_data['text'],
        )
        return Response({'translated_text': translated, 'provider': provider})
