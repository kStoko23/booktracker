using BookTracker.Api.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookTracker.Api.Data.Configurations;

public class BookConfiguration: IEntityTypeConfiguration<Book>
{
    public void Configure(EntityTypeBuilder<Book> builder)
    {
        builder.ToTable("Books");
        
        builder.HasKey(x => x.Id);
        
        builder.Property(x => x.Id).ValueGeneratedOnAdd().HasColumnName("Id").IsRequired();
        builder.Property(x => x.Title).HasColumnName("Title").HasMaxLength(300).IsRequired();
        builder.Property(x => x.Author).HasColumnName("Author").HasMaxLength(200).IsRequired();
        builder.Property(x => x.Isbn).HasColumnName("Isbn").HasMaxLength(30).IsRequired();
        builder.Property(x => x.Pages).HasColumnName("Pages").IsRequired();
        builder.Property(x => x.Rating).HasColumnName("Rating").IsRequired();
        builder.Property(x => x.CreatedAt).HasColumnName("CreatedAt").IsRequired();
        
        builder.HasIndex(x => x.Isbn).IsUnique();
        builder.HasIndex(x => x.Title).IsUnique();
        builder.HasIndex(x => x.Author).IsUnique();
        builder.HasIndex(x => x.CreatedAt).IsUnique();
    }   
}