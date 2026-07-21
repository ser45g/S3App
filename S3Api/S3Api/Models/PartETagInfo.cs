namespace S3Api.Models
{
    public class PartETagInfo
    {
        public required int PartNumber { get; init; }

        public required string ETag { get; init; }
    }

}
