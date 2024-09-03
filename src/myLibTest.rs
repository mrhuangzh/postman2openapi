use postman2openapi::from_path;
use postman2openapi::AddReadOnly;
use postman2openapi::AddRequired;
use postman2openapi::TargetFormat;
use postman2openapi::TranspileOptions;
use std::fs::write;
use std::io::Result;

fn main() -> Result<()> {
    let options = TranspileOptions {
        format: TargetFormat::Json, // Replace with actual format if needed
        add_read_only: AddReadOnly::True,
        add_required: AddRequired::False,
    };

    match from_path(
        "D:/ownerdata/feishu/yongli.postman_collection.json",
        options,
    ) {
        Ok(result) => {
            // Write the result to a file
            write("result-openapi.json", result)?;
            println!("Result successfully written to result-openapi.json");
        }
        Err(e) => eprintln!("Error: {}", e),
    }

    Ok(())
}
