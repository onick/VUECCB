#!/usr/bin/env python3
"""
Ejemplo de uso del sistema de reportes HTML modernos
Centro Cultural Banreservas
"""

import requests
import json

# Configuración
BASE_URL = "http://localhost:8001"
ADMIN_EMAIL = "admin@culturalcenter.com"
ADMIN_PASSWORD = "tu_password_aqui"

def generar_reporte_evento(event_id: str):
    """
    Genera un reporte HTML moderno para un evento específico
    """
    
    # 1. Autenticarse como administrador
    login_data = {
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    }
    
    login_response = requests.post(f"{BASE_URL}/api/login", json=login_data)
    
    if login_response.status_code != 200:
        print("❌ Error en la autenticación")
        return None
    
    # Obtener el token de autenticación
    auth_token = login_response.json().get("access_token")
    headers = {"Authorization": f"Bearer {auth_token}"}
    
    # 2. Generar el reporte HTML
    report_url = f"{BASE_URL}/api/admin/reports/professional/event/{event_id}"
    
    print(f"🔄 Generando reporte para evento {event_id}...")
    
    response = requests.get(report_url, headers=headers)
    
    if response.status_code == 200:
        # Guardar el PDF generado
        filename = f"reporte_evento_{event_id}.pdf"
        with open(filename, "wb") as f:
            f.write(response.content)
        
        print(f"✅ Reporte generado exitosamente: {filename}")
        print(f"📄 Tamaño del archivo: {len(response.content)} bytes")
        return filename
    else:
        print(f"❌ Error generando reporte: {response.status_code}")
        return None

def listar_eventos():
    """
    Lista todos los eventos disponibles
    """
    response = requests.get(f"{BASE_URL}/api/events")
    
    if response.status_code == 200:
        eventos = response.json()
        print("📋 Eventos disponibles:")
        for evento in eventos:
            print(f"  - {evento['id']}: {evento['title']}")
        return eventos
    else:
        print("❌ Error obteniendo eventos")
        return []

if __name__ == "__main__":
    print("🎭 Sistema de Reportes HTML Modernos - Centro Cultural Banreservas")
    print("=" * 70)
    
    # Listar eventos disponibles
    eventos = listar_eventos()
    
    if eventos:
        # Generar reporte para el primer evento como ejemplo
        primer_evento = eventos[0]
        event_id = primer_evento['id']
        
        print(f"\n🎯 Generando reporte para: {primer_evento['title']}")
        archivo_generado = generar_reporte_evento(event_id)
        
        if archivo_generado:
            print(f"\n🎉 ¡Listo! Abre el archivo {archivo_generado} para ver el reporte.")
    else:
        print("⚠️  No hay eventos disponibles para generar reportes.") 