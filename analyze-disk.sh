#!/bin/bash

# Script para análise automática de disco WSL2
# Execute no terminal: ./analyze-disk.sh

API_URL="https://hlkwvwydellekqdtpvzo.supabase.co/functions/v1/analyze-disk"

echo "🔍 Analisando uso de disco..."
echo "⏳ Isso pode levar alguns minutos..."
echo ""

# Executa o comando du e captura a saída
DISK_DATA=$(sudo du -sh /* 2>/dev/null)

if [ -z "$DISK_DATA" ]; then
    echo "❌ Erro: Não foi possível obter dados do disco"
    echo "   Certifique-se de que tem permissões sudo"
    exit 1
fi

echo "📤 Enviando dados para o app..."

# Envia os dados para a API
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "{\"diskData\": \"$DISK_DATA\"}")

# Verifica se foi bem-sucedido
if echo "$RESPONSE" | grep -q "success"; then
    echo "✅ Análise enviada com sucesso!"
    echo "🌐 Verifique os resultados no app: https://9c3d7b6b-2630-465a-b2e4-d7d68c549783.lovableproject.com"
else
    echo "❌ Erro ao enviar dados"
    echo "   Resposta: $RESPONSE"
    exit 1
fi
