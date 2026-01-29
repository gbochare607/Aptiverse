# ETL Mapping for Question Upload

When uploading questions via CSV to `/admin/questions/upload-csv`, use the following column headers.

## Canonical Fields Mapping

| CSV Header      | Database Field  | Type     | Description |
|-----------------|-----------------|----------|-------------|
| `text`          | `text`          | String   | Question text |
| `option1`       | `options[0]`    | String   | First Option |
| `option2`       | `options[1]`    | String   | Second Option |
| `option3`       | `options[2]`    | String   | Third Option |
| `option4`       | `options[3]`    | String   | Fourth Option |
| `correctOption` | `correctOption` | Number   | 1-based index (1-4) |
| `topics`        | `topics`        | String   | Pipe separated, e.g. "Math|Algebra" |
| `difficulty`    | `difficulty`    | Number   | 0.0 to 1.0 |
| `explanation`   | `explanation`   | String   | Solution explanation |

## Validation Rules
- `text` and `correctOption` are mandatory.
- At least 2 options should be non-empty.
- Duplicate questions (by text hash) will be skipped or flagged.
