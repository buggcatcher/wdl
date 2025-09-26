#!/bin/bash

# Script per aggiungere progressive-loader.js a tutte le pagine che usano header-1920x1080.jpeg

echo "🔍 Cercando pagine con header-1920x1080.jpeg..."

# Trova tutti i file HTML che contengono header-1920x1080.jpeg
find . -name "*.html" -type f -exec grep -l "header-1920x1080.jpeg" {} \; | while read file; do
    echo "📝 Processando: $file"
    
    # Controlla se progressive-loader.js è già incluso
    if grep -q "progressive-loader.js" "$file"; then
        echo "  ✅ Progressive loader già presente"
    else
        # Calcola il path relativo per progressive-loader.js
        depth=$(echo "$file" | sed 's|[^/]||g' | wc -c)
        depth=$((depth - 2))  # Sottrai 2 per ./ iniziale e per il file stesso
        
        if [ $depth -eq 0 ]; then
            # File nella root (docs/)
            js_path="js/progressive-loader.js"
        else
            # File in sottodirectory
            js_path=$(printf '../%.0s' $(seq 1 $depth))js/progressive-loader.js
        fi
        
        echo "  📁 Path calcolato: $js_path (depth: $depth)"
        
        # Trova la riga con main.js e aggiungi progressive-loader.js prima
        if grep -q "main.js" "$file"; then
            # Sostituisci la riga main.js aggiungendo progressive-loader prima
            sed -i "s|<script src=\"\([^\"]*\)main.js\"></script>|<script src=\"${js_path}\"></script>\n  <script src=\"\1main.js\"></script>|" "$file"
            echo "  ✅ Aggiunto progressive-loader.js"
        else
            echo "  ⚠️  main.js non trovato in questo file"
        fi
    fi
    echo ""
done

echo "🎉 Script completato!"
