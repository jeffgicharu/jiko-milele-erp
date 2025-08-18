"""
Core application views.
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import connection
from django.core.cache import cache
import redis


class HealthCheckView(APIView):
    """
    Health check endpoint for monitoring application status.
    """
    permission_classes = []
    
    def get(self, request):
        """
        Check the health of various system components.
        """
        health_status = {
            'status': 'healthy',
            'timestamp': '2024-01-01T00:00:00Z',
            'services': {
                'database': self._check_database(),
                'cache': self._check_cache(),
                'redis': self._check_redis(),
            }
        }
        
        # Determine overall status
        if not all(service['status'] == 'healthy' for service in health_status['services'].values()):
            health_status['status'] = 'unhealthy'
            return Response(health_status, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
        return Response(health_status, status=status.HTTP_200_OK)
    
    def _check_database(self):
        """Check database connectivity."""
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                cursor.fetchone()
            return {'status': 'healthy', 'message': 'Database connection successful'}
        except Exception as e:
            return {'status': 'unhealthy', 'message': f'Database connection failed: {str(e)}'}
    
    def _check_cache(self):
        """Check cache connectivity."""
        try:
            cache.set('health_check', 'test', 10)
            if cache.get('health_check') == 'test':
                cache.delete('health_check')
                return {'status': 'healthy', 'message': 'Cache connection successful'}
            else:
                return {'status': 'unhealthy', 'message': 'Cache read/write failed'}
        except Exception as e:
            return {'status': 'unhealthy', 'message': f'Cache connection failed: {str(e)}'}
    
    def _check_redis(self):
        """Check Redis connectivity."""
        try:
            from django.conf import settings
            r = redis.from_url(settings.REDIS_URL)
            r.ping()
            return {'status': 'healthy', 'message': 'Redis connection successful'}
        except Exception as e:
            return {'status': 'unhealthy', 'message': f'Redis connection failed: {str(e)}'}
