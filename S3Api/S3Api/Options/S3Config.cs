using System.ComponentModel.DataAnnotations;

namespace S3Api.Options
{
    public class S3Config
    {
        [Required]
        public required string KeyId { get; init; }
        [Required]
        public required string SecretKey { get; init; }
        [Required]
        public required string Region { get; init; }
        [Required]
        public required string BucketName { get; init; }
        [Required]
        public required string ServiceUrl { get; init; }

    }
}
