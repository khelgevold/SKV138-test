-- SKV138 TEST: initialiser felles tilstand nøyaktig én gang.
-- Kun i Neon SKV138-TEST. Ingen eksempelbookinger eller lagervarer.
-- Eksisterende shared-data blir ALDRI overskrevet.
BEGIN;
INSERT INTO public.skv138_data (id, payload, version, updated_at)
VALUES (
  'shared',
  '{
    "settings": {"checkin":"16:00","checkout":"12:00","heatBefore":24,"gateBefore":24,"heatOffAfter":0},
    "bookings": [],
    "completed": {},
    "stock": [],
    "templates": {
      "before": [
        {"id":"b1","name":"Rengjøre hytta","condition":"always"},
        {"id":"b2","name":"Kontrollere forbruksvarer","condition":"always"},
        {"id":"b3","name":"Klargjøre stamp","condition":"stamp"},
        {"id":"b4","name":"Kontrollere elbillader","condition":"charger"},
        {"id":"b5","name":"Legge frem sengetøy","condition":"linen"}
      ],
      "after": [
        {"id":"a1","name":"Kontrollere rengjøring","condition":"always"},
        {"id":"a2","name":"Kontrollere skader","condition":"always"},
        {"id":"a3","name":"Kontrollere stamp","condition":"stamp"},
        {"id":"a4","name":"Kontrollere låser og vinduer","condition":"always"}
      ]
    },
    "privateLocations": ["Kjøleskap","Kjøkkenskap","Bod"]
  }'::jsonb,
  1,
  now()
)
ON CONFLICT (id) DO NOTHING;
COMMIT;
-- Etter kjøring: SELECT id, version, jsonb_array_length(payload->'bookings') AS bookings,
-- jsonb_array_length(payload->'stock') AS stock FROM public.skv138_data WHERE id='shared';
