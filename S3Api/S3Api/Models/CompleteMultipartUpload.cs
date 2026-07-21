namespace S3Api.Models
{
    public class CompleteMultipartUpload
    {
        public required string Key { get; init; }

        public required string UploadId { get; init; }

        public List<PartETagInfo> Parts { get; init; } = [];
    }

}
