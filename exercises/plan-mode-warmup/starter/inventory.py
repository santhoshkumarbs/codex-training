"""Simple inventory management module with a few issues to fix."""


def add_item(inventory, name, quantity, price):
    """Add or replace an item in the inventory.

    Args:
        inventory: A mapping of item names to dictionaries containing
            ``quantity`` and ``price`` values.
        name: The item name to insert or replace.
        quantity: The quantity to store for the item.
        price: The unit price to store for the item.
    """
    inventory[name] = {"quantity": quantity, "price": price}


def remove_item(inventory, name):
    """Remove an item from the inventory if it exists.

    Args:
        inventory: A mapping of item names to dictionaries containing
            ``quantity`` and ``price`` values.
        name: The item name to remove.
    """
    inventory.pop(name, None)


def get_total_value(inventory):
    """Calculate the total value of all items in the inventory.

    Args:
        inventory: A mapping of item names to dictionaries containing
            ``quantity`` and ``price`` values.

    Returns:
        The sum of ``quantity * price`` for all items in the inventory.
    """
    total = 0
    for item in inventory:
        total += inventory[item]["quantity"] * inventory[item]["price"]
    return total


def apply_discount(inventory, name, percent):
    """Apply a percentage discount to an item's price in place.

    Args:
        inventory: A mapping of item names to dictionaries containing
            ``quantity`` and ``price`` values.
        name: The item name whose price will be updated.
        percent: The discount percentage to apply, such as ``20`` for a
            20 percent discount.

    Raises:
        KeyError: If ``name`` is not present in ``inventory``.
    """
    item = inventory[name]
    item["price"] = item["price"] - (item["price"] * (percent / 100))


def find_low_stock(inventory, threshold):
    """Find items with quantity below a threshold.

    Args:
        inventory: A mapping of item names to dictionaries containing
            ``quantity`` and ``price`` values.
        threshold: The exclusive upper bound for low-stock items.

    Returns:
        A list of item names whose quantity is less than ``threshold``.
    """
    results = []
    for name in inventory:
        if inventory[name]["quantity"] < threshold:
            results.append(name)
    return results


def restock(inventory, name, amount):
    """Increase the quantity for an existing item in place.

    Args:
        inventory: A mapping of item names to dictionaries containing
            ``quantity`` and ``price`` values.
        name: The item name to update.
        amount: The quantity to add to the existing stock level.

    Raises:
        KeyError: If ``name`` is not present in ``inventory``.
    """
    inventory[name]["quantity"] = inventory[name]["quantity"] + amount


def generate_report(inventory):
    """Generate a formatted text report for the inventory.

    Args:
        inventory: A mapping of item names to dictionaries containing
            ``quantity`` and ``price`` values.

    Returns:
        A newline-delimited string containing the inventory report,
        including a header, one line per item, and a total row.
    """
    lines = []
    lines.append("=== Inventory Report ===")
    lines.append(f"{'Item':<20} {'Qty':>5} {'Price':>8} {'Value':>10}")
    lines.append("-" * 45)
    for name in sorted(inventory.keys()):
        item = inventory[name]
        value = item["quantity"] * item["price"]
        lines.append(f"{name:<20} {item['quantity']:>5} {item['price']:>8.2f} {value:>10.2f}")
    lines.append("-" * 45)
    lines.append(f"{'Total':<20} {'':>5} {'':>8} {get_total_value(inventory):>10.2f}")
    return "\n".join(lines)
