namespace SharperExpenser.DataTransferObjects;

public class FilterRequest
{
    public decimal? AmountFrom { get; set; } = null;
    public decimal? AmountTo { get; set; } = null;
    public DateTime? DateFrom { get; set; } = null;
    public DateTime? DateTo { get; set; } = null;
    public string? Currency { get; set; } = null;
    public string? Category { get; set; } = null;
}