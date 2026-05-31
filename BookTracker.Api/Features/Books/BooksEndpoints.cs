using BookTracker.Api.Data;
using BookTracker.Api.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookTracker.Api.Features.Books;

public static class BooksEndpoints
{
    public static void MapBooksEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/books").WithTags("Books");
        group.MapGet("/", GetBooks);
        group.MapPost("/", CreateBook);
    }

    private static async Task<IResult> GetBooks(BooksDbContext db, [AsParameters] BookQueryParameters parameters)
    {
        var page = Math.Max(parameters.Page ?? 1, 1);
        var pageSize = Math.Clamp(parameters.PageSize ?? 20, 1, 100);

        var query = db.Books.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(parameters.Search))
        {
            var pattern = $"{parameters.Search.Trim()}%";
            query = query.Where(x => 
                EF.Functions.Like(x.Title, pattern) || 
                EF.Functions.Like(x.Author, pattern));
        }

        var books = await query
            .OrderByDescending(x => x.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new BookResponse
            {
                Id = x.Id,
                Title = x.Title,
                Author = x.Author,
                Isbn = x.Isbn,
                Pages = x.Pages,
                Rating = x.Rating
            })
            .ToListAsync();
        
        return Results.Ok(books);
    }

    private static async Task<IResult> CreateBook(BooksDbContext db, [FromBody] CreateBookRequest request)
    {
        var errors = ValidateCreateBookRequest(request);
        if (errors.Count > 0)
        {
            return Results.ValidationProblem(errors);
        }

        var book = new Book()
        {
            Title = request.Title.Trim(),
            Author = request.Author.Trim(),
            Isbn = request.Isbn.Trim(),
            Pages = request.Pages,
            Rating = request.Rating,
        };
        
        db.Books.Add(book);
        await db.SaveChangesAsync();

        var response = new BookResponse
        {
            Id = book.Id,
            Title = book.Title,
            Author = book.Author,
            Isbn = book.Isbn,
            Pages = book.Pages,
            Rating = book.Rating
        };
        
        Console.WriteLine($"Title: {book.Title}");
        Console.WriteLine($"Author: {book.Author}");
        Console.WriteLine($"Isbn: {book.Isbn}");
        Console.WriteLine($"Pages: {book.Pages}");
        Console.WriteLine($"Rating: {book.Rating}");
        
        return Results.Created($"/api/books/{book.Id}", response);
    }

    private static Dictionary<string, string[]> ValidateCreateBookRequest(CreateBookRequest request)
    {
        var errors = new Dictionary<string, string[]>();

        if (string.IsNullOrWhiteSpace(request.Title))
            errors["title"] = ["Title is required"];
        if (string.IsNullOrWhiteSpace(request.Author))
            errors["author"] = ["Author is required"];
        if (string.IsNullOrWhiteSpace(request.Isbn))
            errors["isbn"] = ["ISBN is required"];
        if (request.Pages <= 0)
            errors["pages"] = ["Pages can't be less or equal to 0"];
        if (request.Rating < 1 || request.Rating > 5)
            errors["rating"] = ["Rating must be between 1 and 5"];

        return errors;
    }
}