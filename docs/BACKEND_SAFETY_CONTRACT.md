# Backend Safety Contract

## Search Endpoint

- Route: POST /api/rides/search
- Validation: strict payload validation with zod
- Safety input: safety.genderPolicy in {any, women_only, same_gender_only}
- Rule: backend applies policy in query layer; client cannot widen visibility

## Booking Endpoint

- Route: POST /api/rides/book
- Validation: strict booking payload and explicit agreedToTerms = true
- Rule: backend re-checks ride policy against authenticated, verified user context
- Rule: reject booking if policy not satisfied, even if search previously returned ride

## Privacy and Abuse Resistance

- Use authenticated identity only (no trust in client-supplied profile fields)
- Keep audit logs for policy-rejected booking attempts
- Return generic errors to avoid leaking sensitive demographic attributes
