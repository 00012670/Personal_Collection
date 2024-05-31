
using Microsoft.EntityFrameworkCore;
using API.Context;
public class LikeService
{
    private readonly DBContext _context;

    public LikeService(DBContext context)
    {
        _context = context;
    }

    public async Task<UserLike?> FindUserLike(int userId, int id)
    {
        return await _context.UserLikes.FindAsync(userId, id);
    }

    public async Task<Item?> FindItem(int id)
    {
        return await _context.Items.FindAsync(id);
    }

    public async Task AddUserLike(int userId, int id)
    {
        var userLike = new UserLike
        {
            UserId = userId,
            ItemId = id
        };
        await _context.UserLikes.AddAsync(userLike);
        await _context.SaveChangesAsync();
    }

    public async Task RemoveUserLike(UserLike userLike)
    {
        _context.UserLikes.Remove(userLike);
        await _context.SaveChangesAsync();
    }

    public async Task IncrementItemLikes(Item item)
    {
        item.Likes++;
        _context.Entry(item).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }

    public async Task DecrementItemLikes(Item item)
    {
        item.Likes--;
        _context.Entry(item).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }
}